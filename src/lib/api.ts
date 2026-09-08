import type { Scene, SceneInsert, SceneUpdate, Segment, SegmentInsert } from '@/lib/types';

const STORAGE_KEY = 'panowan.local-data.v1';

interface LocalData {
  scenes: Scene[];
  segments: Segment[];
}

function emptyData(): LocalData {
  return { scenes: [], segments: [] };
}

function readData(): LocalData {
  if (typeof window === 'undefined') return emptyData();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as Partial<LocalData>;
    return {
      scenes: Array.isArray(parsed.scenes) ? parsed.scenes : [],
      segments: Array.isArray(parsed.segments) ? parsed.segments : [],
    };
  } catch {
    return emptyData();
  }
}

function writeData(data: LocalData): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function byNewestFirst(a: Scene, b: Scene): number {
  return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
}

export async function fetchScenes(): Promise<Scene[]> {
  return [...readData().scenes].sort(byNewestFirst);
}

export async function fetchScene(id: string): Promise<Scene> {
  const scene = readData().scenes.find(item => item.id === id);
  if (!scene) throw new Error('Sahne bulunamadı');
  return scene;
}

export async function createScene(scene: SceneInsert): Promise<Scene> {
  const data = readData();
  const nextScene: Scene = {
    blind_zone_desc: scene.blind_zone_desc ?? null,
    camera_height_cm: scene.camera_height_cm ?? null,
    created_at: scene.created_at ?? new Date().toISOString(),
    date_label: scene.date_label ?? null,
    id: scene.id ?? createId(),
    image_url: scene.image_url ?? null,
    location_name: scene.location_name ?? null,
    notes: scene.notes ?? null,
    season: scene.season ?? null,
    style_preset: scene.style_preset ?? null,
    time_of_day: scene.time_of_day ?? null,
    title: scene.title,
    user_id: scene.user_id ?? 'local',
    weather: scene.weather ?? null,
  };

  writeData({ ...data, scenes: [nextScene, ...data.scenes] });
  return nextScene;
}

export async function updateScene(id: string, scene: SceneUpdate): Promise<Scene> {
  const data = readData();
  const index = data.scenes.findIndex(item => item.id === id);
  if (index === -1) throw new Error('Sahne bulunamadı');

  const nextScene = { ...data.scenes[index], ...scene, id };
  const scenes = [...data.scenes];
  scenes[index] = nextScene;
  writeData({ ...data, scenes });
  return nextScene;
}

export async function deleteScene(id: string): Promise<void> {
  const data = readData();
  writeData({
    scenes: data.scenes.filter(scene => scene.id !== id),
    segments: data.segments.filter(segment => segment.scene_id !== id),
  });
}

export async function fetchSegments(sceneId: string): Promise<Segment[]> {
  return readData()
    .segments
    .filter(segment => segment.scene_id === sceneId)
    .sort((a, b) => (a.zone - b.zone) || (a.slice - b.slice));
}

export async function upsertSegment(segment: SegmentInsert): Promise<Segment> {
  const data = readData();
  const index = data.segments.findIndex(
    item => item.scene_id === segment.scene_id && item.zone === segment.zone && item.slice === segment.slice
  );
  const now = new Date().toISOString();
  const existing = index >= 0 ? data.segments[index] : null;
  const nextSegment: Segment = {
    camera_speed: segment.camera_speed !== undefined ? segment.camera_speed : existing?.camera_speed ?? null,
    content_desc: segment.content_desc !== undefined ? segment.content_desc : existing?.content_desc ?? null,
    extra_notes: segment.extra_notes !== undefined ? segment.extra_notes : existing?.extra_notes ?? null,
    generated_prompt: segment.generated_prompt !== undefined ? segment.generated_prompt : existing?.generated_prompt ?? null,
    id: segment.id ?? existing?.id ?? createId(),
    image_url: segment.image_url !== undefined ? segment.image_url : existing?.image_url ?? null,
    lighting_direction: segment.lighting_direction !== undefined ? segment.lighting_direction : existing?.lighting_direction ?? null,
    motion_type: segment.motion_type !== undefined ? segment.motion_type : existing?.motion_type ?? null,
    scene_id: segment.scene_id,
    slice: segment.slice,
    status: segment.status ?? existing?.status ?? 'empty',
    updated_at: now,
    zone: segment.zone,
  };

  const segments = [...data.segments];
  if (index >= 0) {
    segments[index] = nextSegment;
  } else {
    segments.push(nextSegment);
  }
  writeData({ ...data, segments });
  return nextSegment;
}

export async function fetchSceneSegmentCount(sceneId: string): Promise<number> {
  return readData().segments.filter(
    segment => segment.scene_id === sceneId && segment.status !== 'empty'
  ).length;
}
