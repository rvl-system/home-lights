DROP TABLE "philips_hue_info";
CREATE TABLE IF NOT EXISTS "philips_hue_info" (
  username TEXT NOT NULL UNIQUE,
  key TEXT NOT NULL,
  ip TEXT NOT NULL
);
