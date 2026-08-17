/**
 * Design system — Nhật ký Mật Ong:
 * Tiến trình được lưu như những trang sổ thực địa; không có điểm số, chỉ có dấu vết đã được khu vườn giữ lại.
 */

export type TimeOfDay = "day" | "night";
export type Weather = "clear" | "rain";
export type PlantState = "empty" | "seed" | "thirsty" | "bloom" | "mutated";
export type RegionKey = "porch" | "seed" | "lake" | "hive" | "room";

export type GardenPlot = {
  id: number;
  name: string;
  state: PlantState;
  emoji: string;
  note: string;
};

export type MemoryRegionProgress = {
  status: 0 | 1 | 2 | 3;
  fragments: string[];
  steps: string[];
};

export type MemoryProgress = Record<RegionKey, MemoryRegionProgress>;

export type GardenProgressSnapshot = {
  version: 2;
  updatedAt: string;
  time: TimeOfDay;
  weather: Weather;
  plots: GardenPlot[];
  selectedPlot: number;
  water: number;
  seeds: number;
  honey: number;
  beeBond: number;
  butterflySeen: boolean;
  memory: MemoryProgress;
};

export const GARDEN_PROGRESS_KEY = "vuon-nho-cua-ong:progress:v2";

const blankRegion = (): MemoryRegionProgress => ({ status: 0, fragments: [], steps: [] });

export function createMemoryProgress(): MemoryProgress {
  return {
    porch: { status: 1, fragments: ["porch-voice"], steps: [] },
    seed: blankRegion(),
    lake: blankRegion(),
    hive: blankRegion(),
    room: blankRegion(),
  };
}

export function mergeMemoryProgress(saved?: Partial<MemoryProgress> | null): MemoryProgress {
  const base = createMemoryProgress();
  if (!saved) return base;
  return (Object.keys(base) as RegionKey[]).reduce<MemoryProgress>((result, key) => {
    const candidate = saved[key];
    result[key] = {
      status: candidate && [0, 1, 2, 3].includes(candidate.status) ? candidate.status : base[key].status,
      fragments: Array.isArray(candidate?.fragments) ? candidate.fragments.filter((entry): entry is string => typeof entry === "string") : base[key].fragments,
      steps: Array.isArray(candidate?.steps) ? candidate.steps.filter((entry): entry is string => typeof entry === "string") : base[key].steps,
    };
    return result;
  }, {} as MemoryProgress);
}

export function loadGardenProgress(): Partial<GardenProgressSnapshot> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(GARDEN_PROGRESS_KEY);
    if (!raw) return {};
    const value = JSON.parse(raw) as Partial<GardenProgressSnapshot>;
    if (value.version !== 2) return {};
    return value;
  } catch {
    return {};
  }
}

export function saveGardenProgress(snapshot: GardenProgressSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GARDEN_PROGRESS_KEY, JSON.stringify(snapshot));
  } catch {
    // Không chặn trải nghiệm khi trình duyệt đang từ chối bộ nhớ cục bộ.
  }
}
