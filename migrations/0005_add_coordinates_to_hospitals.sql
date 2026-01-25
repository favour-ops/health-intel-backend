-- Add latitude and longitude columns
ALTER TABLE hospitals
ADD COLUMN latitude FLOAT8,
ADD COLUMN longitude FLOAT8;

-- Add a check to ensure coordinates are valid (optional but good practice)
ALTER TABLE hospitals
ADD CONSTRAINT check_lat_range CHECK (latitude BETWEEN -90 AND 90),
ADD CONSTRAINT check_lng_range CHECK (longitude BETWEEN -180 AND 180);