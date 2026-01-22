INSERT INTO hospitals (
  id,
  name,
  hospital_type,
  state,
  city,
  is_active
)
VALUES
(
  gen_random_uuid(),
  'St. Mary''s Medical Centre',
  'PRIVATE',
  'Lagos',
  'Yaba',
  TRUE
),
(
  gen_random_uuid(),
  'Abuja Central Hospital',
  'PUBLIC',
  'FCT',
  'Garki',
  TRUE
),
(
  gen_random_uuid(),
  'Unity Specialist Hospital',
  'PRIVATE',
  'Rivers',
  'Port Harcourt',
  TRUE
);
