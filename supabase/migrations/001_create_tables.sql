-- ============================================
-- Manai Mitra — Complete Reset + Migration v3
-- Includes: Aadhaar, DOB, facing, road_size
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS plots    CASCADE;
DROP TABLE IF EXISTS places   CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- PROFILES
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL DEFAULT '',
  full_name   TEXT DEFAULT '',
  avatar_url  TEXT DEFAULT '',
  phone       TEXT DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','seller','owner')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'buyer'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- DIVISIONS
CREATE TABLE divisions (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PLACES
CREATE TABLE places (
  id          INTEGER PRIMARY KEY,
  division_id INTEGER NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PLOTS
CREATE TABLE plots (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  place_id          INTEGER REFERENCES places(id),

  -- Public info (visible to all buyers)
  title             TEXT NOT NULL,
  description       TEXT,
  area_sqft         NUMERIC NOT NULL CHECK (area_sqft > 0),
  price             NUMERIC NOT NULL CHECK (price > 0),
  division          TEXT,
  place             TEXT,
  type              TEXT DEFAULT 'Residential Plot',
  facing            TEXT DEFAULT 'East',
  road_size         TEXT DEFAULT '',
  dtcp_approved     BOOLEAN DEFAULT FALSE,
  land_photos       TEXT[] DEFAULT '{}',
  views             INTEGER DEFAULT 0,

  -- Private seller details (admin only)
  seller_name       TEXT,
  seller_phone      TEXT,
  seller_address    TEXT,
  dob               TEXT,
  patta_number      TEXT,
  chitta_number     TEXT,
  survey_number     TEXT,
  aadhaar_front     TEXT,
  aadhaar_back      TEXT,
  doc_copies        TEXT[] DEFAULT '{}',

  -- Status & AI
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected')),
  ai_check_result   JSONB,
  ai_check_passed   BOOLEAN DEFAULT FALSE,

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS plots_updated_at ON plots;
CREATE TRIGGER plots_updated_at
  BEFORE UPDATE ON plots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots     ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE places    ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles viewable by all"  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile"  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile"  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Divisions & Places
CREATE POLICY "Divisions are public" ON divisions FOR SELECT USING (true);
CREATE POLICY "Places are public"    ON places    FOR SELECT USING (true);

-- Plots
CREATE POLICY "Approved plots public"    ON plots FOR SELECT USING (status = 'approved');
CREATE POLICY "Sellers see own plots"    ON plots FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers insert plots"     ON plots FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers update own plots" ON plots FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers delete own plots" ON plots FOR DELETE USING (auth.uid() = seller_id);
