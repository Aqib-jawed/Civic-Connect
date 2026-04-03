-- ==============================================================
-- CIVIC-CONNECT — COMPLETE DATABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ==============================================================


-- ==============================================================
-- TABLES
-- ==============================================================

CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'citizen'
              CHECK (role IN ('citizen', 'admin', 'field_agent')),
  region_id   UUID,
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.regions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL UNIQUE,
  city           TEXT NOT NULL,
  state          TEXT NOT NULL,
  assigned_admin UUID REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_region
  FOREIGN KEY (region_id) REFERENCES public.regions(id);

CREATE TABLE public.issues (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by        UUID NOT NULL REFERENCES public.profiles(id),
  category           TEXT NOT NULL CHECK (category IN (
                       'pothole','drainage_overflow','water_leakage',
                       'garbage','streetlight_failure','road_damage',
                       'tree_fallen','other'
                     )),
  title              TEXT NOT NULL,
  description        TEXT,
  latitude           DOUBLE PRECISION NOT NULL,
  longitude          DOUBLE PRECISION NOT NULL,
  address            TEXT,
  region_id          UUID REFERENCES public.regions(id),
  images             TEXT[] DEFAULT '{}',
  status             TEXT NOT NULL DEFAULT 'submitted'
                     CHECK (status IN (
                       'submitted','acknowledged','assigned',
                       'in_progress','resolved','rejected'
                     )),
  assigned_to        UUID REFERENCES public.profiles(id),
  assigned_at        TIMESTAMPTZ,
  resolution_note    TEXT,
  resolution_images  TEXT[] DEFAULT '{}',
  resolved_at        TIMESTAMPTZ,
  severity           TEXT DEFAULT 'medium'
                     CHECK (severity IN ('low','medium','high','critical')),
  upvotes            INTEGER DEFAULT 0,
  is_anonymous       BOOLEAN DEFAULT false,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.issue_status_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id     UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  changed_by   UUID NOT NULL REFERENCES public.profiles(id),
  from_status  TEXT,
  to_status    TEXT NOT NULL,
  note         TEXT,
  images       TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.issue_upvotes (
  issue_id    UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (issue_id, user_id)
);

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_id    UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.field_teams (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  region_id      UUID REFERENCES public.regions(id),
  lead_id        UUID REFERENCES public.profiles(id),
  contact_phone  TEXT,
  specialization TEXT[],
  is_available   BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================
-- INDEXES
-- ==============================================================

CREATE INDEX idx_issues_reported_by ON public.issues(reported_by);
CREATE INDEX idx_issues_status      ON public.issues(status);
CREATE INDEX idx_issues_region      ON public.issues(region_id);
CREATE INDEX idx_issues_category    ON public.issues(category);
CREATE INDEX idx_issues_created_at  ON public.issues(created_at DESC);
CREATE INDEX idx_status_logs_issue  ON public.issue_status_logs(issue_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);


-- ==============================================================
-- TRIGGERS
-- ==============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.issue_status_logs (
      issue_id, changed_by, from_status, to_status
    ) VALUES (
      NEW.id, auth.uid(), OLD.status, NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER issues_status_log
  AFTER UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION log_status_change();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION notify_citizen_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (
      user_id, issue_id, type, title, message
    ) VALUES (
      NEW.reported_by,
      NEW.id,
      'status_update',
      'Issue Status Updated',
      'Your issue "' || NEW.title || '" is now ' || REPLACE(NEW.status, '_', ' ')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER issues_notify_citizen
  AFTER UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION notify_citizen_on_status_change();


-- ==============================================================
-- ROW LEVEL SECURITY
-- ==============================================================

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_upvotes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_teams       ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ISSUES
CREATE POLICY "issues_citizen_select_own"
  ON public.issues FOR SELECT
  USING (reported_by = auth.uid());

CREATE POLICY "issues_citizen_insert"
  ON public.issues FOR INSERT
  WITH CHECK (reported_by = auth.uid());

CREATE POLICY "issues_admin_all"
  ON public.issues FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- STATUS LOGS
CREATE POLICY "status_logs_select"
  ON public.issue_status_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.issues
      WHERE id = issue_id AND reported_by = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "status_logs_insert_admin"
  ON public.issue_status_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'field_agent')
    )
  );

-- NOTIFICATIONS
CREATE POLICY "notifications_own"
  ON public.notifications FOR ALL
  USING (user_id = auth.uid());

-- UPVOTES
CREATE POLICY "upvotes_select"
  ON public.issue_upvotes FOR SELECT
  USING (true);

CREATE POLICY "upvotes_insert_own"
  ON public.issue_upvotes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "upvotes_delete_own"
  ON public.issue_upvotes FOR DELETE
  USING (user_id = auth.uid());

-- REGIONS
CREATE POLICY "regions_select_all"
  ON public.regions FOR SELECT
  USING (true);

CREATE POLICY "regions_admin_all"
  ON public.regions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- FIELD TEAMS
CREATE POLICY "teams_select_all"
  ON public.field_teams FOR SELECT
  USING (true);

CREATE POLICY "teams_admin_all"
  ON public.field_teams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ==============================================================
-- STORAGE BUCKETS
-- ==============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('issue-images',      'issue-images',      true),
  ('resolution-images', 'resolution-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "issue_images_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'issue-images');

CREATE POLICY "issue_images_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'issue-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "resolution_images_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resolution-images');

CREATE POLICY "resolution_images_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resolution-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'field_agent')
    )
  );


-- ==============================================================
-- SEED DATA — Regions
-- ==============================================================

INSERT INTO public.regions (name, city, state) VALUES
  ('Ward 5 – BTM Layout',    'Bengaluru', 'Karnataka'),
  ('Ward 8 – Koramangala',   'Bengaluru', 'Karnataka'),
  ('Ward 12 – MG Road',      'Bengaluru', 'Karnataka'),
  ('Ward 14 – Indiranagar',  'Bengaluru', 'Karnataka'),
  ('Ward 6 – Jayanagar',     'Bengaluru', 'Karnataka'),
  ('Ward 18 – Whitefield',   'Bengaluru', 'Karnataka')
ON CONFLICT DO NOTHING;