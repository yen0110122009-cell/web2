/**
 * Design system — Nhật ký Mật Ong:
 * Bàn sắp đặt là một trang mẫu vật sống; lịch sử, bản sao và preset mùa phải giống dụng cụ ghi chép trên bàn làm vườn, không phải HUD game.
 */
import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { Copy, Grid3X3, LockKeyhole, Move, Redo2, RotateCcw, Sparkles, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import type { DecorationPlacement, GridSettings, MemoryProgress, RegionKey, SeasonPreset } from "@/lib/garden-progress";
import "./memory-rewards.css";
import "./layout-studio.css";

type Reward = { key: RegionKey; name: string; note: string; symbol: string; className: string };
type SeasonalPreset = { key: SeasonPreset; label: string; symbol: string; note: string; positions: Array<[RegionKey, number, number, number, number]> };

const REWARDS: Reward[] = [
  { key: "porch", name: "Đèn Hiên Mật", note: "Sáng dịu mỗi khi Ong được gọi tên.", symbol: "✦", className: "lantern" },
  { key: "seed", name: "Luống Đom Đóm", note: "Chỉ nhấp nháy vào mưa đêm.", symbol: "✧", className: "fireflies" },
  { key: "lake", name: "Chuông Nước Bạc", note: "Một tiếng leng keng gọi vòng gợn trở lại.", symbol: "◌", className: "bell" },
  { key: "hive", name: "Biển Ong Gỗ", note: "Giữ lại khoảng lặng ở giữa đường bay.", symbol: "⌂", className: "sign" },
  { key: "room", name: "Cổng Lời Nhắc", note: "Một khung cửa cho những ngày đã liền mạch.", symbol: "◇", className: "gate" },
];

const DEFAULT_POSITIONS: Record<RegionKey, Pick<DecorationPlacement, "x" | "y" | "rotation" | "scale">> = {
  porch: { x: 13, y: 24, rotation: 0, scale: 1 },
  seed: { x: 78, y: 25, rotation: 0, scale: 1 },
  lake: { x: 23, y: 80, rotation: 0, scale: 1 },
  hive: { x: 86, y: 69, rotation: 0, scale: 1 },
  room: { x: 48, y: 18, rotation: 0, scale: 1 },
};

const SEASONAL_PRESETS: SeasonalPreset[] = [
  { key: "spring", label: "Xuân · Mầm non", symbol: "✿", note: "Những điều vừa nảy", positions: [["porch", 14, 24, -6, 1.05], ["seed", 68, 29, 8, 1], ["lake", 31, 74, -9, .92], ["hive", 78, 65, 4, .86], ["room", 50, 17, 0, 1.08]] },
  { key: "summer", label: "Hạ · Mật sáng", symbol: "☀", note: "Đường bay rộng mở", positions: [["porch", 12, 67, -10, .9], ["seed", 76, 23, 12, 1.1], ["lake", 38, 80, 6, 1.04], ["hive", 84, 56, -7, .9], ["room", 46, 26, 0, 1.15]] },
  { key: "autumn", label: "Thu · Lá ép", symbol: "❋", note: "Gom lại dấu chân", positions: [["porch", 20, 22, 12, .9], ["seed", 76, 73, -15, 1], ["lake", 23, 77, 5, 1.08], ["hive", 76, 49, 8, .86], ["room", 50, 36, -4, 1.1]] },
  { key: "winter", label: "Đông · Mực đêm", symbol: "☾", note: "Giữ ấm những điều nhớ", positions: [["porch", 19, 32, -8, .86], ["seed", 74, 28, 11, .88], ["lake", 27, 70, -5, 1], ["hive", 80, 65, 4, .94], ["room", 49, 19, 0, 1.22]] },
];

function isUnlocked(progress: MemoryProgress, key: RegionKey) {
  return progress[key].status === 3;
}

function clamp(value: number, lower: number, upper: number, precision = 1) {
  const power = 10 ** precision;
  return Math.max(lower, Math.min(upper, Math.round(value * power) / power));
}

function snap(value: number, grid: GridSettings) {
  return grid.enabled ? Math.round(value / grid.size) * grid.size : value;
}

function nextPlacementId(rewardKey: RegionKey, placements: DecorationPlacement[]) {
  const prefix = `${rewardKey}-`;
  let sequence = placements.filter((placement) => placement.id === rewardKey || placement.id.startsWith(prefix)).length + 1;
  let candidate = `${rewardKey}-${sequence}`;
  while (placements.some((placement) => placement.id === candidate)) candidate = `${rewardKey}-${++sequence}`;
  return candidate;
}

function makeSeasonalLayout(preset: SeasonalPreset, progress: MemoryProgress) {
  return preset.positions.filter(([rewardKey]) => isUnlocked(progress, rewardKey)).map(([rewardKey, x, y, rotation, scale], index) => ({ id: `${rewardKey}-${preset.key}-${index + 1}`, rewardKey, x, y, rotation, scale }));
}

export function GardenDecorations({
  progress,
  placements,
  grid,
  activePreset,
  canUndo,
  canRedo,
  onPlacementChange,
  onGridChange,
  onUndo,
  onRedo,
  onApplyPreset,
}: {
  progress: MemoryProgress;
  placements: DecorationPlacement[];
  grid: GridSettings;
  activePreset: SeasonPreset | null;
  canUndo: boolean;
  canRedo: boolean;
  onPlacementChange: (placements: DecorationPlacement[]) => void;
  onGridChange: (grid: GridSettings) => void;
  onUndo: () => void;
  onRedo: () => void;
  onApplyPreset: (placements: DecorationPlacement[], preset: SeasonPreset) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const unlocked = REWARDS.filter((reward) => isUnlocked(progress, reward.key));

  function placementFor(id: string) {
    return placements.find((placement) => placement.id === id) ?? null;
  }

  function updatePlacement(id: string, patch: Partial<Omit<DecorationPlacement, "id" | "rewardKey">>) {
    const current = placementFor(id);
    if (!current) return;
    const proposed = { ...current, ...patch };
    const next: DecorationPlacement = {
      ...current,
      x: clamp(snap(proposed.x, grid), 4, 96),
      y: clamp(snap(proposed.y, grid), 7, 92),
      rotation: clamp(proposed.rotation, -180, 180, 0),
      scale: clamp(proposed.scale, 0.65, 1.5, 2),
    };
    onPlacementChange(placements.map((placement) => placement.id === id ? next : placement));
  }

  function duplicatePlacement(id: string) {
    const current = placementFor(id);
    if (!current) return;
    const copy: DecorationPlacement = { ...current, id: nextPlacementId(current.rewardKey, placements), x: clamp(snap(current.x + 5, grid), 4, 96), y: clamp(snap(current.y + 5, grid), 7, 92) };
    onPlacementChange([...placements, copy]);
    setSelectedId(copy.id);
  }

  function moveToPointer(id: string, clientX: number, clientY: number) {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return;
    updatePlacement(id, { x: ((clientX - bounds.left) / bounds.width) * 100, y: ((clientY - bounds.top) / bounds.height) * 100 });
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>, id: string) {
    event.currentTarget.focus();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedId(id);
    setDragging(id);
    moveToPointer(id, event.clientX, event.clientY);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (dragging === id) moveToPointer(id, event.clientX, event.clientY);
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (dragging === id) setDragging(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    const current = placementFor(id);
    if (!current) return;
    const step = event.shiftKey ? 5 : 2;
    const move = event.key === "ArrowLeft" ? [-step, 0] : event.key === "ArrowRight" ? [step, 0] : event.key === "ArrowUp" ? [0, -step] : event.key === "ArrowDown" ? [0, step] : null;
    if (move && event.altKey) {
      event.preventDefault();
      updatePlacement(id, { rotation: current.rotation + (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -15 : 15) });
      return;
    }
    if (move) {
      event.preventDefault();
      updatePlacement(id, { x: current.x + move[0], y: current.y + move[1] });
      return;
    }
    if (event.key === "[" || event.key === "-") {
      event.preventDefault();
      updatePlacement(id, { scale: current.scale - .1 });
    }
    if (event.key === "]" || event.key === "+" || event.key === "=") {
      event.preventDefault();
      updatePlacement(id, { scale: current.scale + .1 });
    }
    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      updatePlacement(id, { rotation: 0, scale: 1 });
    }
  }

  const selected = selectedId ? placementFor(selectedId) : null;
  const selectedReward = selected ? REWARDS.find((reward) => reward.key === selected.rewardKey) : null;

  return (
    <div className="garden-decorations" ref={canvasRef} aria-label="Các phần thưởng đã đặt trong khu vườn">
      <div className={`garden-align-grid ${grid.enabled ? "is-visible" : ""}`} aria-hidden="true" />
      <button type="button" className={`grid-toggle ${grid.enabled ? "active" : ""}`} onClick={() => onGridChange({ ...grid, enabled: !grid.enabled })} aria-pressed={grid.enabled}>
        <Grid3X3 size={13} /> {grid.enabled ? "Đang bám lưới" : "Bật lưới căn"}
      </button>
      <div className="layout-history-strip" role="group" aria-label="Lịch sử sắp đặt">
        <button type="button" onClick={onUndo} disabled={!canUndo} aria-label="Hoàn tác thao tác sắp đặt"><Undo2 size={13} /> Hoàn tác</button>
        <button type="button" onClick={onRedo} disabled={!canRedo} aria-label="Làm lại thao tác sắp đặt"><Redo2 size={13} /> Làm lại</button>
      </div>
      <section className="season-preset-tray" aria-label="Bố cục theo mùa">
        <header><Sparkles size={12} /> Trang theo mùa <small>Áp dụng nhanh</small></header>
        <div className="season-preset-list">{SEASONAL_PRESETS.map((preset) => <button key={preset.key} type="button" className={`season-preset ${activePreset === preset.key ? "active" : ""}`} title={preset.note} onClick={() => onApplyPreset(makeSeasonalLayout(preset, progress), preset.key)}><span>{preset.symbol}</span>{preset.label}</button>)}</div>
      </section>
      <div className="season-ink" aria-hidden="true">ghi theo mùa · bỏ qua là không sao</div>
      {unlocked.flatMap((reward) => placements.filter((placement) => placement.rewardKey === reward.key).map((placement) => {
        const style = { left: `${placement.x}%`, top: `${placement.y}%`, "--decoration-rotation": `${placement.rotation}deg`, "--decoration-scale": placement.scale } as CSSProperties;
        return (
          <button key={placement.id} type="button" className={`garden-decoration ${reward.className} ${dragging === placement.id ? "is-dragging" : ""} ${selectedId === placement.id ? "is-selected" : ""}`} style={style} aria-label={`${reward.name}. Mũi tên để di chuyển, Alt cộng mũi tên để xoay, ngoặc vuông để đổi kích thước.`} onFocus={() => setSelectedId(placement.id)} onPointerDown={(event) => handlePointerDown(event, placement.id)} onPointerMove={(event) => handlePointerMove(event, placement.id)} onPointerUp={(event) => handlePointerEnd(event, placement.id)} onPointerCancel={(event) => handlePointerEnd(event, placement.id)} onKeyDown={(event) => handleKeyDown(event, placement.id)}>
            <span className="decoration-object"><i>{reward.symbol}</i><b /></span>
            <span className="decoration-label"><Move size={10} /> {reward.name}</span>
          </button>
        );
      }))}
      {selected && selectedReward && (
        <div className="decoration-toolbox" role="group" aria-label={`Dụng cụ cho ${selectedReward.name}`}>
          <span><Move size={12} /> {selectedReward.name}</span>
          <button type="button" onClick={() => updatePlacement(selected.id, { rotation: selected.rotation - 15 })} aria-label="Xoay sang trái">↶</button>
          <button type="button" onClick={() => updatePlacement(selected.id, { rotation: selected.rotation + 15 })} aria-label="Xoay sang phải">↷</button>
          <button type="button" onClick={() => updatePlacement(selected.id, { scale: selected.scale - .1 })} aria-label="Thu nhỏ"><ZoomOut size={13} /></button>
          <button type="button" onClick={() => updatePlacement(selected.id, { scale: selected.scale + .1 })} aria-label="Phóng to"><ZoomIn size={13} /></button>
          <button type="button" className="duplicate-decoration" onClick={() => duplicatePlacement(selected.id)} aria-label="Sao chép hiện vật"><Copy size={12} /> Sao chép</button>
          <button type="button" onClick={() => updatePlacement(selected.id, { rotation: 0, scale: 1 })} aria-label="Trả về xoay và kích thước ban đầu"><RotateCcw size={13} /></button>
        </div>
      )}
    </div>
  );
}

export function MemoryRewards({ progress, placements, onPlacementChange, onVisitGarden }: { progress: MemoryProgress; placements: DecorationPlacement[]; onPlacementChange: (placements: DecorationPlacement[]) => void; onVisitGarden: () => void }) {
  const unlocked = REWARDS.filter((reward) => isUnlocked(progress, reward.key)).length;

  function placeReward(reward: Reward) {
    if (!placements.some((placement) => placement.rewardKey === reward.key)) {
      onPlacementChange([...placements, { id: nextPlacementId(reward.key, placements), rewardKey: reward.key, ...DEFAULT_POSITIONS[reward.key] }]);
    }
    onVisitGarden();
  }

  return (
    <section className="memory-rewards" aria-label="Trang trí ký ức">
      <header><div><p className="eyebrow">Dấu vết trở về</p><h3>Tủ trang trí của khu vườn</h3></div><span className="reward-count"><Sparkles size={14} /> {unlocked}/5</span></header>
      <p className="reward-instruction">Đặt hiện vật vào trang vườn, kéo thả đến vị trí vừa ý, rồi dùng tay nắm để xoay hoặc co giãn. Khi cần lặp lại một dấu vết, hãy sao chép ngay tại bề mặt vườn.</p>
      <div className="reward-shelf">{REWARDS.map((reward) => {
        const unlockedReward = isUnlocked(progress, reward.key);
        const copies = placements.filter((placement) => placement.rewardKey === reward.key).length;
        return <article key={reward.key} className={`reward-card ${reward.className} ${unlockedReward ? "unlocked" : "locked"}`}><div className="reward-object"><span>{unlockedReward ? reward.symbol : <LockKeyhole size={16} />}</span></div><div><small>{unlockedReward ? copies ? `${copies} dấu vết trong vườn` : "Đã trở về" : "Đang chờ dấu ấn"}</small><strong>{reward.name}</strong><p>{unlockedReward ? reward.note : "Hoàn thành dấu ấn của căn phòng tương ứng để nhận hiện vật này."}</p>{unlockedReward && <button type="button" className="place-reward" onClick={() => placeReward(reward)}>{copies ? "Thêm một dấu vết" : "Đặt vào vườn"}</button>}</div></article>;
      })}</div>
    </section>
  );
}
