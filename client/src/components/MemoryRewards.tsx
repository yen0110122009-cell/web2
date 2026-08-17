/**
 * Design system — Nhật ký Mật Ong:
 * Phần thưởng là hiện vật được người làm vườn ghim lên trang mẫu vật sống; mọi điều khiển phải giống dụng cụ thực địa, không giống HUD.
 */
import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { Grid3X3, LockKeyhole, Move, RotateCcw, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import type { DecorationPlacement, GridSettings, MemoryProgress, RegionKey } from "@/lib/garden-progress";
import "./memory-rewards.css";

type Reward = { key: RegionKey; name: string; note: string; symbol: string; className: string };

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

export function GardenDecorations({
  progress,
  placements,
  grid,
  onPlacementChange,
  onGridChange,
}: {
  progress: MemoryProgress;
  placements: DecorationPlacement[];
  grid: GridSettings;
  onPlacementChange: (placements: DecorationPlacement[]) => void;
  onGridChange: (grid: GridSettings) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<RegionKey | null>(null);
  const [selectedId, setSelectedId] = useState<RegionKey | null>(null);
  const unlocked = REWARDS.filter((reward) => isUnlocked(progress, reward.key));

  function placementFor(id: RegionKey) {
    return placements.find((placement) => placement.id === id) ?? null;
  }

  function updatePlacement(id: RegionKey, patch: Partial<Omit<DecorationPlacement, "id">>) {
    const current = placementFor(id) ?? { id, ...DEFAULT_POSITIONS[id] };
    const proposed = { ...current, ...patch };
    const next: DecorationPlacement = {
      id,
      x: clamp(snap(proposed.x, grid), 4, 96),
      y: clamp(snap(proposed.y, grid), 7, 92),
      rotation: clamp(proposed.rotation, -180, 180, 0),
      scale: clamp(proposed.scale, 0.65, 1.5, 2),
    };
    onPlacementChange([...placements.filter((placement) => placement.id !== id), next]);
  }

  function moveToPointer(id: RegionKey, clientX: number, clientY: number) {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return;
    updatePlacement(id, { x: ((clientX - bounds.left) / bounds.width) * 100, y: ((clientY - bounds.top) / bounds.height) * 100 });
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>, id: RegionKey) {
    event.currentTarget.focus();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedId(id);
    setDragging(id);
    moveToPointer(id, event.clientX, event.clientY);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>, id: RegionKey) {
    if (dragging !== id) return;
    moveToPointer(id, event.clientX, event.clientY);
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>, id: RegionKey) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (dragging === id) setDragging(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: RegionKey) {
    const current = placementFor(id) ?? { id, ...DEFAULT_POSITIONS[id] };
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
      updatePlacement(id, { scale: current.scale - 0.1 });
    }
    if (event.key === "]" || event.key === "+" || event.key === "=") {
      event.preventDefault();
      updatePlacement(id, { scale: current.scale + 0.1 });
    }
    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      updatePlacement(id, { rotation: 0, scale: 1 });
    }
  }

  const selected = selectedId ? placementFor(selectedId) : null;
  const selectedReward = selectedId ? REWARDS.find((reward) => reward.key === selectedId) : null;

  return (
    <div className="garden-decorations" ref={canvasRef} aria-label="Các phần thưởng đã đặt trong khu vườn">
      <div className={`garden-align-grid ${grid.enabled ? "is-visible" : ""}`} aria-hidden="true" />
      <button type="button" className={`grid-toggle ${grid.enabled ? "active" : ""}`} onClick={() => onGridChange({ ...grid, enabled: !grid.enabled })} aria-pressed={grid.enabled}>
        <Grid3X3 size={13} /> {grid.enabled ? "Đang bám lưới" : "Bật lưới căn"}
      </button>
      {unlocked.map((reward) => {
        const placement = placementFor(reward.key);
        if (!placement) return null;
        const style = {
          left: `${placement.x}%`,
          top: `${placement.y}%`,
          "--decoration-rotation": `${placement.rotation}deg`,
          "--decoration-scale": placement.scale,
        } as CSSProperties;
        return (
          <button
            key={reward.key}
            type="button"
            className={`garden-decoration ${reward.className} ${dragging === reward.key ? "is-dragging" : ""} ${selectedId === reward.key ? "is-selected" : ""}`}
            style={style}
            aria-label={`${reward.name}. Mũi tên để di chuyển, Alt cộng mũi tên để xoay, ngoặc vuông để đổi kích thước.`}
            onFocus={() => setSelectedId(reward.key)}
            onPointerDown={(event) => handlePointerDown(event, reward.key)}
            onPointerMove={(event) => handlePointerMove(event, reward.key)}
            onPointerUp={(event) => handlePointerEnd(event, reward.key)}
            onPointerCancel={(event) => handlePointerEnd(event, reward.key)}
            onKeyDown={(event) => handleKeyDown(event, reward.key)}
          >
            <span className="decoration-object"><i>{reward.symbol}</i><b /></span>
            <span className="decoration-label"><Move size={10} /> {reward.name}</span>
          </button>
        );
      })}
      {selected && selectedReward && (
        <div className="decoration-toolbox" role="group" aria-label={`Dụng cụ cho ${selectedReward.name}`}>
          <span><Move size={12} /> {selectedReward.name}</span>
          <button type="button" onClick={() => updatePlacement(selected.id, { rotation: selected.rotation - 15 })} aria-label="Xoay sang trái">↶</button>
          <button type="button" onClick={() => updatePlacement(selected.id, { rotation: selected.rotation + 15 })} aria-label="Xoay sang phải">↷</button>
          <button type="button" onClick={() => updatePlacement(selected.id, { scale: selected.scale - 0.1 })} aria-label="Thu nhỏ"><ZoomOut size={13} /></button>
          <button type="button" onClick={() => updatePlacement(selected.id, { scale: selected.scale + 0.1 })} aria-label="Phóng to"><ZoomIn size={13} /></button>
          <button type="button" onClick={() => updatePlacement(selected.id, { rotation: 0, scale: 1 })} aria-label="Trả về xoay và kích thước ban đầu"><RotateCcw size={13} /></button>
        </div>
      )}
    </div>
  );
}

export function MemoryRewards({ progress, placements, onPlacementChange, onVisitGarden }: { progress: MemoryProgress; placements: DecorationPlacement[]; onPlacementChange: (placements: DecorationPlacement[]) => void; onVisitGarden: () => void }) {
  const unlocked = REWARDS.filter((reward) => isUnlocked(progress, reward.key)).length;

  function placeReward(reward: Reward) {
    if (!placements.some((placement) => placement.id === reward.key)) {
      onPlacementChange([...placements, { id: reward.key, ...DEFAULT_POSITIONS[reward.key] }]);
    }
    onVisitGarden();
  }

  return (
    <section className="memory-rewards" aria-label="Trang trí ký ức">
      <header><div><p className="eyebrow">Dấu vết trở về</p><h3>Tủ trang trí của khu vườn</h3></div><span className="reward-count"><Sparkles size={14} /> {unlocked}/5</span></header>
      <p className="reward-instruction">Đặt hiện vật vào trang vườn, kéo thả đến vị trí vừa ý, rồi dùng tay nắm để xoay hoặc co giãn.</p>
      <div className="reward-shelf">{REWARDS.map((reward) => {
        const unlockedReward = isUnlocked(progress, reward.key);
        const placed = placements.some((placement) => placement.id === reward.key);
        return <article key={reward.key} className={`reward-card ${reward.className} ${unlockedReward ? "unlocked" : "locked"}`}><div className="reward-object"><span>{unlockedReward ? reward.symbol : <LockKeyhole size={16} />}</span></div><div><small>{unlockedReward ? placed ? "Đã đặt trong vườn" : "Đã trở về" : "Đang chờ dấu ấn"}</small><strong>{reward.name}</strong><p>{unlockedReward ? reward.note : "Hoàn thành dấu ấn của căn phòng tương ứng để nhận hiện vật này."}</p>{unlockedReward && <button type="button" className="place-reward" onClick={() => placeReward(reward)}>{placed ? "Chỉnh vị trí" : "Đặt vào vườn"}</button>}</div></article>;
      })}</div>
    </section>
  );
}
