CREATE TABLE "system_state" (
  zone_id INTEGER NOT NULL UNIQUE,
  power INTEGER DEFAULT 0,
  current_scene_id INTEGER,
  FOREIGN KEY (zone_id) REFERENCES zones(id)
  FOREIGN KEY (current_scene_id) REFERENCES scenes(id)
);
