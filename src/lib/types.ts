export interface Scene {
  blind_zone_desc: string | null;
  camera_height_cm: number | null;
  created_at: string | null;
  date_label: string | null;
  id: string;
  image_url: string | null;
  location_name: string | null;
  notes: string | null;
  season: string | null;
  style_preset: string | null;
  time_of_day: string | null;
  title: string;
  user_id: string | null;
  weather: string | null;
}

export type SceneInsert = Partial<Omit<Scene, 'id' | 'created_at' | 'title'>> & {
  id?: string;
  created_at?: string | null;
  title: string;
};

export type SceneUpdate = Partial<SceneInsert>;

export interface Segment {
  camera_speed: string | null;
  content_desc: string | null;
  extra_notes: string | null;
  generated_prompt: string | null;
  id: string;
  image_url: string | null;
  lighting_direction: string | null;
  motion_type: string | null;
  scene_id: string;
  slice: number;
  status: string | null;
  updated_at: string | null;
  zone: number;
}

export type SegmentInsert = Partial<Omit<Segment, 'id' | 'updated_at' | 'scene_id' | 'zone' | 'slice'>> & {
  id?: string;
  scene_id: string;
  slice: number;
  updated_at?: string | null;
  zone: number;
};

export type SegmentUpdate = Partial<SegmentInsert>;

export interface SegmentPosition {
  zone: number;
  slice: number;
}
