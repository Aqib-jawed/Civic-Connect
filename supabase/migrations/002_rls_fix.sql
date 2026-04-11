-- ==============================================================
-- CIVIC-CONNECT — CRITICAL RLS + TRIGGER PATCH
-- Run this ENTIRE script in:
-- Supabase Dashboard → SQL Editor → New Query → Run
--
-- This fixes:
-- 1. Profile creation on new user signup (trigger)
-- 2. Issues INSERT for authenticated citizens
-- 3. Admin can see ALL profiles and ALL issues
-- 4. Realtime enabled on issues table
-- ==============================================================


-- ==============================================================
-- 1. FIX: handle_new_user trigger
--    Ensures every new signup automatically creates a profile row
-- ==============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        phone     = EXCLUDED.phone,
        role      = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger (drop first to avoid duplicate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================
-- 2. FIX: profiles RLS — allow admins to read ALL profiles
--    (needed for admin middleware role check)
-- ==============================================================

-- Drop old conflicting policies
DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;

-- Allow every authenticated user to read their OWN profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to read ALL profiles (needed for issue assignment display)
CREATE POLICY "profiles_admin_select_all"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Allow users to update only their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- ==============================================================
-- 3. FIX: issues RLS — ensure citizens can INSERT and SELECT own
--    and admins can do EVERYTHING
-- ==============================================================

-- Remove old policies to avoid conflicts
DROP POLICY IF EXISTS "issues_citizen_select_own" ON public.issues;
DROP POLICY IF EXISTS "issues_citizen_insert"     ON public.issues;
DROP POLICY IF EXISTS "issues_admin_all"          ON public.issues;

-- Citizens can see ONLY their own issues
CREATE POLICY "issues_citizen_select_own"
  ON public.issues FOR SELECT
  USING (reported_by = auth.uid());

-- Citizens can INSERT issues where reported_by = their own ID
CREATE POLICY "issues_citizen_insert"
  ON public.issues FOR INSERT
  WITH CHECK (reported_by = auth.uid());

-- Admins can do all operations on all issues
CREATE POLICY "issues_admin_all"
  ON public.issues FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ==============================================================
-- 4. FIX: Enable Realtime on issues table
--    (so useIssues subscription gets live updates)
-- ==============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;


-- ==============================================================
-- 5. FIX: Storage — allow authenticated users to upload images
-- ==============================================================

-- Drop and recreate storage policies to be safe
DROP POLICY IF EXISTS "issue_images_insert" ON storage.objects;

CREATE POLICY "issue_images_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'issue-images'
    AND auth.uid() IS NOT NULL
  );

-- Allow public read of issue images
DROP POLICY IF EXISTS "issue_images_select" ON storage.objects;
CREATE POLICY "issue_images_select"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('issue-images', 'resolution-images'));


-- ==============================================================
-- 6. VERIFY: Check tables exist and have correct structure
-- ==============================================================

-- You should see rows for: profiles, issues, regions, etc.
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
