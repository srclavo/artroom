-- Sprint 4: Job Fair, Search, Collections, Reviews, Reports
-- ============================================================

-- 1. saved_jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved jobs"
  ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved jobs"
  ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved jobs"
  ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- 2. collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public collections visible to all"
  ON collections FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert own collections"
  ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE USING (auth.uid() = user_id);

-- 3. collection_items table
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (collection_id, design_id)
);

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collection items visible if collection is visible"
  ON collection_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections c
      WHERE c.id = collection_items.collection_id
        AND (c.is_public = true OR c.user_id = auth.uid())
    )
  );
CREATE POLICY "Users can add to own collections"
  ON collection_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections c
      WHERE c.id = collection_items.collection_id AND c.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can remove from own collections"
  ON collection_items FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM collections c
      WHERE c.id = collection_items.collection_id AND c.user_id = auth.uid()
    )
  );

-- 4. reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, design_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews visible to all"
  ON reviews FOR SELECT USING (true);
CREATE POLICY "Auth users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE USING (auth.uid() = user_id);

-- 5. reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_type TEXT NOT NULL CHECK (reported_type IN ('design', 'user', 'review', 'job')),
  reported_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'copyright', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- 6. Full text search setup
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add view_count to jobs if missing (for trending)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS view_count INT NOT NULL DEFAULT 0;

-- Indexes for search
CREATE INDEX IF NOT EXISTS idx_designs_title_trgm ON designs USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_designs_tags ON designs USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm ON profiles USING gin (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name_trgm ON profiles USING gin (display_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm ON jobs USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON jobs USING gin (skills_required);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_reviews_design ON reviews(design_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_likes_design ON likes(design_id);
CREATE INDEX IF NOT EXISTS idx_likes_created ON likes(created_at);
