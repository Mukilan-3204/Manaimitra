-- ============================================
-- Manai Mitra — DB Patch v3
-- Run this ONLY if DB already existed before v3
-- Adds: dob, aadhaar_front, aadhaar_back, facing, road_size, views
-- ============================================

ALTER TABLE plots ADD COLUMN IF NOT EXISTS facing        TEXT DEFAULT 'East';
ALTER TABLE plots ADD COLUMN IF NOT EXISTS road_size     TEXT DEFAULT '';
ALTER TABLE plots ADD COLUMN IF NOT EXISTS dtcp_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE plots ADD COLUMN IF NOT EXISTS chitta_number TEXT;
ALTER TABLE plots ADD COLUMN IF NOT EXISTS dob           TEXT;
ALTER TABLE plots ADD COLUMN IF NOT EXISTS aadhaar_front TEXT;
ALTER TABLE plots ADD COLUMN IF NOT EXISTS aadhaar_back  TEXT;
ALTER TABLE plots ADD COLUMN IF NOT EXISTS views         INTEGER DEFAULT 0;

-- ============================================
-- Manai Mitra — Seed Data v2
-- Run AFTER migration (if starting fresh)
-- ============================================

INSERT INTO divisions (id, name, icon, description) VALUES
  (1, 'Madurai Central', '🏛️', 'Historic temple area, bustling markets, and heritage landmarks.'),
  (2, 'Madurai North',   '🌆', 'Modern residential hubs — K.K. Nagar, Anna Nagar, well-planned colonies.'),
  (3, 'Madurai South',   '⛰️', 'Scenic hill views — Pasumalai, Thirupparankundram, and premium residential zones.'),
  (4, 'Madurai East',    '🌿', 'Rural charm meets growth — Melur, Alanganallur, and investment corridors.'),
  (5, 'Madurai West',    '🏞️', 'Gateway to the hills — Vadipatti, Usilampatti, and agricultural belt opportunities.')
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, icon=EXCLUDED.icon, description=EXCLUDED.description;

INSERT INTO places (id, division_id, name, description) VALUES
  (101,1,'Meenakshi Temple Area','Heritage zone near the iconic temple'),
  (102,1,'Periyar Bus Stand','Major transit and commercial hub'),
  (103,1,'Town Hall','Administrative center of the city'),
  (104,1,'Teppakulam','Famous temple tank neighbourhood'),
  (105,1,'Pudhu Mandapam','Historical market arcade'),
  (106,1,'Nethaji Road','Busy commercial street'),
  (107,1,'East Masi Street','Traditional bazaar street'),
  (108,1,'West Masi Street','Vibrant market corridor'),
  (109,1,'South Masi Street','Cultural shopping area'),
  (110,1,'North Masi Street','Heritage commercial district'),
  (201,2,'K.K. Nagar','Premium residential colony'),
  (202,2,'Anna Nagar','Well-developed residential area'),
  (203,2,'Arappalayam','Growing commercial zone'),
  (204,2,'Tallakulam','Central residential area'),
  (205,2,'Koodal Nagar','Planned township'),
  (206,2,'Goripalayam','Historic neighbourhood'),
  (207,2,'Jaihindpuram','Popular residential locality'),
  (208,2,'Aavin','Industrial and residential mix'),
  (209,2,'Simmakkal','Traditional market area'),
  (210,2,'Villapuram','Suburban residential zone'),
  (301,3,'Thirupparankundram','Temple town with hill views'),
  (302,3,'Pasumalai','Hilltop premium locality'),
  (303,3,'Vilangudi','Rapidly developing area'),
  (304,3,'Nagamalai Pudukottai','Hill-adjacent township'),
  (305,3,'Surveyor Colony','Established residential area'),
  (306,3,'Gomathipuram','Well-connected locality'),
  (307,3,'S.S. Colony','Premium gated community area'),
  (308,3,'Thirunagar','Popular residential hub'),
  (309,3,'Vishwanathapuram','Growing residential zone'),
  (310,3,'Thathaneri','Modern residential neighbourhood'),
  (401,4,'Melur','Major taluk headquarters'),
  (402,4,'Keelavalavu','Scenic rural area'),
  (403,4,'Alanganallur','Famous for Jallikattu'),
  (404,4,'Sholavandan','Historic temple town'),
  (405,4,'Vaigai Dam Area','Waterfront properties'),
  (406,4,'Thiruppuvanam','Weaving town'),
  (407,4,'Samayanallur','Suburban growth area'),
  (408,4,'Othakadai','Commercial corridor'),
  (409,4,'T. Kallupatti','Agricultural hub'),
  (410,4,'Elumalai','Rural investment zone'),
  (501,5,'Vadipatti','Taluk headquarters'),
  (502,5,'Usilampatti','Growing market town'),
  (503,5,'Andipatti','Agricultural zone'),
  (504,5,'Theni Road Area','Highway corridor'),
  (505,5,'Perungudi','Developing locality'),
  (506,5,'Checkanurani','Suburban residential'),
  (507,5,'Thirumangalam','Major town center'),
  (508,5,'Peraiyur','Historic market town'),
  (509,5,'Kalligudi','Agricultural hub'),
  (510,5,'Sedapatti','Emerging growth area')
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description;
