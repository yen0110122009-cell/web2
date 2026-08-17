/**
 * Design system — Nhật ký Mật Ong:
 * Phần thưởng là những hiện vật được trả về từ ký ức; người làm vườn tự chọn nơi đặt chúng trên trang mẫu vật sống.
 */
import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { LockKeyhole, Move, Sparkles } from "lucide-react";
import type { DecorationPlacement, MemoryProgress, RegionKey } from "@/lib/garden-progress";
import "./memory-rewards.css";

type Reward = { key: RegionKey; name: string; note: string; symbol: string; className: string };

const REWARDS: Reward[] = [
  { key: "porch", name: "Đèn Hiên Mật", note: "Sáng dịu mỗi khi Ong được gọi tên.", symbol: "✦", className: "lantern" },
  { key: "seed", name: "Luống Đom Đóm", note: "Chỉ nhấp nháy vào mưa đêm.", symbol: "✧", className: "fireflies" },
  { key: "lake", name: "Chuông Nước Bạc", note: "Một tiếng leng keng gọi vòng gợn trở lại.", symbol: "◌", className: "bell" },
  { key: "hive", name: "Biển Ong Gỗ", note: "Giữ lại khoảng lặng ở giữa đường bay.", symbol: "⌂", className: "sign" },
  { key: "room", name: "Cổng Lời Nhắc", note: "Một khung cửa cho những ngày đã liền mạch.", symbol: "◇", className: "gate" },
];

const DEFAULT_POSITIONS: Record<RegionKey, Pick<DecorationPlacement, "x" | "y">> = {
  porch: { x: 13, y: 24 },
  seed: { x: 78, y: 25 },
  lake: { x: 23, y: 80 },
  hive: { x: 86, y: 69 },
  room: { x: 48, y: 18 },
};

function isUnlocked(progress: MemoryProgress, key: RegionKey) {
  return progress[key].status === 3;
}

function clamp(value: number, lower: number, upper: number) {
  return Math.max(lower, Math.min(upper, Math.round(value * 10) / 10));
}

export function GardenDecorations({ progress, placements, onPlacementChange }: { progress: MemoryProgress; placements: DecorationPlacement[]; onPlacementChange: (placements: DecorationPlacement[]) => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<RegionKey | null>(null);
  const unlocked = REWARDS.filter((reward) => isUnlocked(progress, reward.key));

  function placementFor(id: RegionKey) {
    return placements.find((placement) => placement.id === id) ?? null;
  }

  function updatePlacement(id: RegionKey, x: number, y: number) {
    const next = { id, x: clamp(x, 4, 96), y: clamp(y, 7, 92) };
    onPlacementChange([...placements.filter((placement) => placement.id !== id), next]);
  }

  function moveToPointer(id: RegionKey, clientX: number, clientY: number) {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return;
    updatePlacement(id, ((clientX - bounds.left) / bounds.width) * 100, ((clientY - bounds.top) / bounds.height) * 100);
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>, id: RegionKey) {
    event.currentTarget.focus();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
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
    const delta = event.key === "ArrowLeft" ? [-step, 0] : event.key === "ArrowRight" ? [step, 0] : event.key === "ArrowUp" ? [0, -step] : event.key === "ArrowDown" ? [0, step] : null;
    if (!delta) return;
    event.preventDefault();
    updatePlacement(id, current.x + delta[0], current.y + delta[1]);
  }

  return (
    <div className="garden-decorations" ref={canvasRef} aria-label="Các phần thưởng đã đặt trong khu vườn">
      {unlocked.map((reward) => {
        const placement = placementFor(reward.key);
        if (!placement) return null;
        return (
          <button
            key={reward.key}
            type="button"
            className={`garden-decoration ${reward.className} ${dragging === reward.key ? "is-dragging" : ""}`}
            style={{ left: `${placement.x}%`, top: `${placement.y}%` }}
            aria-label={`${reward.name}. Kéo thả để đổi vị trí; dùng phím mũi tên để căn chỉnh.`}
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
      <p className="reward-instruction">Đặt một hiện vật vào trang vườn, rồi kéo thả nó đến vị trí bạn thấy vừa ý.</p>
      <div className="reward-shelf">{REWARDS.map((reward) => {
        const unlockedReward = isUnlocked(progress, reward.key);
        const placed = placements.some((placement) => placement.id === reward.key);
        return <article key={reward.key} className={`reward-card ${reward.className} ${unlockedReward ? "unlocked" : "locked"}`}><div className="reward-object"><span>{unlockedReward ? reward.symbol : <LockKeyhole size={16} />}</span></div><div><small>{unlockedReward ? placed ? "Đã đặt trong vườn" : "Đã trở về" : "Đang chờ dấu ấn"}</small><strong>{reward.name}</strong><p>{unlockedReward ? reward.note : "Hoàn thành dấu ấn của căn phòng tương ứng để nhận hiện vật này."}</p>{unlockedReward && <button type="button" className="place-reward" onClick={() => placeReward(reward)}>{placed ? "Chỉnh vị trí" : "Đặt vào vườn"}</button>}</div></article>;
      })}</div>
    </section>
  );
}
