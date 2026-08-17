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

export type DecorationPlacement = {
  id: RegionKey;
  x: number;
  y: number;
};

export type GardenProgressSnapshot = {
  version: 4;
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
  decorations: DecorationPlacement[];
};

type BackupEnvelope = {
  kind: "vuon-nho-cua-ong-backup";
  format: 1;
  exportedAt: string;
  progress: GardenProgressSnapshot;
};

export const GARDEN_PROGRESS_KEY = "vuon-nho-cua-ong:progress:v4";
const LEGACY_PROGRESS_KEYS = ["vuon-nho-cua-ong:progress:v3", "vuon-nho-cua-ong:progress:v2"];
const MAX_BACKUP_SIZE = 1_000_000;
const REGION_KEYS: RegionKey[] = ["porch", "seed", "lake", "hive", "room"];
const PLANT_STATES: PlantState[] = ["empty", "seed", "thirsty", "bloom", "mutated"];

const blankRegion = (): MemoryRegionProgress => ({ status: 0, fragments: [], steps: [] });

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.slice(0, 120) : fallback;
}

function asAmount(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(9999, Math.round(value))) : fallback;
}

function asPlot(value: unknown): GardenPlot | null {
  if (!isRecord(value) || typeof value.id !== "number" || !Number.isInteger(value.id)) return null;
  const state = PLANT_STATES.includes(value.state as PlantState) ? (value.state as PlantState) : null;
  if (!state) return null;
  return { id: value.id, name: asString(value.name, "Ô đất nhỏ"), state, emoji: asString(value.emoji, "·"), note: asString(value.note, "Một dấu vết yên lặng.") };
}

function asDecoration(value: unknown): DecorationPlacement | null {
  if (!isRecord(value) || !REGION_KEYS.includes(value.id as RegionKey)) return null;
  if (typeof value.x !== "number" || !Number.isFinite(value.x) || typeof value.y !== "number" || !Number.isFinite(value.y)) return null;
  return {
    id: value.id as RegionKey,
    x: Math.max(4, Math.min(96, Math.round(value.x * 10) / 10)),
    y: Math.max(6, Math.min(92, Math.round(value.y * 10) / 10)),
  };
}

function mergeDecorations(value: unknown): DecorationPlacement[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<RegionKey>();
  return value.reduce<DecorationPlacement[]>((placements, entry) => {
    const placement = asDecoration(entry);
    if (placement && !seen.has(placement.id)) {
      seen.add(placement.id);
      placements.push(placement);
    }
    return placements;
  }, []);
}

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
  return REGION_KEYS.reduce<MemoryProgress>((result, key) => {
    const candidate = saved[key];
    result[key] = {
      status: candidate && [0, 1, 2, 3].includes(candidate.status) ? candidate.status : base[key].status,
      fragments: Array.isArray(candidate?.fragments) ? candidate.fragments.filter((entry): entry is string => typeof entry === "string").slice(0, 80) : base[key].fragments,
      steps: Array.isArray(candidate?.steps) ? candidate.steps.filter((entry): entry is string => typeof entry === "string").slice(0, 120) : base[key].steps,
    };
    return result;
  }, {} as MemoryProgress);
}

export function normalizeGardenProgress(value: unknown): GardenProgressSnapshot | null {
  if (!isRecord(value) || (value.version !== 2 && value.version !== 3 && value.version !== 4) || !Array.isArray(value.plots)) return null;
  const plots = value.plots.map(asPlot).filter((plot): plot is GardenPlot => Boolean(plot));
  if (!plots.length) return null;
  const time: TimeOfDay = value.time === "night" ? "night" : "day";
  const weather: Weather = value.weather === "rain" ? "rain" : "clear";
  return {
    version: 4,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
    time,
    weather,
    plots,
    selectedPlot: asAmount(value.selectedPlot, plots[0].id),
    water: asAmount(value.water, 4),
    seeds: asAmount(value.seeds, 3),
    honey: asAmount(value.honey, 42),
    beeBond: asAmount(value.beeBond, 14),
    butterflySeen: value.butterflySeen === true,
    memory: mergeMemoryProgress(isRecord(value.memory) ? (value.memory as Partial<MemoryProgress>) : undefined),
    decorations: mergeDecorations(value.decorations),
  };
}

export function loadGardenProgress(): Partial<GardenProgressSnapshot> {
  if (typeof window === "undefined") return {};
  try {
    const current = window.localStorage.getItem(GARDEN_PROGRESS_KEY);
    const legacy = current ? null : LEGACY_PROGRESS_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean) ?? null;
    const restored = normalizeGardenProgress(JSON.parse(current ?? legacy ?? "null"));
    return restored ?? {};
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

export function serializeGardenBackup(snapshot: GardenProgressSnapshot) {
  const envelope: BackupEnvelope = { kind: "vuon-nho-cua-ong-backup", format: 1, exportedAt: new Date().toISOString(), progress: snapshot };
  return JSON.stringify(envelope, null, 2);
}

export function parseGardenBackup(raw: string): { snapshot: GardenProgressSnapshot } | { error: string } {
  if (raw.length > MAX_BACKUP_SIZE) return { error: "Tệp này quá lớn để là một trang sao lưu của khu vườn." };
  try {
    const parsed: unknown = JSON.parse(raw);
    const source = isRecord(parsed) && parsed.kind === "vuon-nho-cua-ong-backup" ? parsed.progress : parsed;
    const snapshot = normalizeGardenProgress(source);
    return snapshot ? { snapshot } : { error: "Tệp không chứa một tiến trình Vườn Nhỏ Của Ong hợp lệ." };
  } catch {
    return { error: "Không thể đọc tệp này. Hãy chọn đúng tệp JSON đã xuất từ khu vườn." };
  }
}
