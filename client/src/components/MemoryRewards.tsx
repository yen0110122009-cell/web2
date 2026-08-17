/**
 * Design system — Nhật ký Mật Ong:
 * Phần thưởng là những đồ vật nhỏ được khu vườn trả lại, không phải huy hiệu thành tích hay vật phẩm tăng cấp.
 */
import { LockKeyhole, Sparkles } from "lucide-react";
import type { MemoryProgress, RegionKey } from "@/lib/garden-progress";
import "./memory-rewards.css";

type Reward = { key: RegionKey; name: string; note: string; symbol: string; className: string };

const REWARDS: Reward[] = [
  { key: "porch", name: "Đèn Hiên Mật", note: "Sáng dịu mỗi khi Ong được gọi tên.", symbol: "✦", className: "lantern" },
  { key: "seed", name: "Luống Đom Đóm", note: "Chỉ nhấp nháy vào mưa đêm.", symbol: "✧", className: "fireflies" },
  { key: "lake", name: "Chuông Nước Bạc", note: "Một tiếng leng keng gọi vòng gợn trở lại.", symbol: "◌", className: "bell" },
  { key: "hive", name: "Biển Ong Gỗ", note: "Giữ lại khoảng lặng ở giữa đường bay.", symbol: "⌂", className: "sign" },
  { key: "room", name: "Cổng Lời Nhắc", note: "Một khung cửa cho những ngày đã liền mạch.", symbol: "◇", className: "gate" },
];

function isUnlocked(progress: MemoryProgress, key: RegionKey) {
  return progress[key].status === 3;
}

export function GardenDecorations({ progress }: { progress: MemoryProgress }) {
  return <div className="garden-decorations" aria-hidden="true">{REWARDS.filter((reward) => isUnlocked(progress, reward.key)).map((reward) => <span key={reward.key} className={`garden-decoration ${reward.className}`}><i>{reward.symbol}</i><b /></span>)}</div>;
}

export function MemoryRewards({ progress }: { progress: MemoryProgress }) {
  const unlocked = REWARDS.filter((reward) => isUnlocked(progress, reward.key)).length;
  return (
    <section className="memory-rewards" aria-label="Trang trí ký ức">
      <header><div><p className="eyebrow">Dấu vết trở về</p><h3>Tủ trang trí của khu vườn</h3></div><span className="reward-count"><Sparkles size={14} /> {unlocked}/5</span></header>
      <div className="reward-shelf">{REWARDS.map((reward) => {
        const unlockedReward = isUnlocked(progress, reward.key);
        return <article key={reward.key} className={`reward-card ${reward.className} ${unlockedReward ? "unlocked" : "locked"}`}><div className="reward-object"><span>{unlockedReward ? reward.symbol : <LockKeyhole size={16} />}</span></div><div><small>{unlockedReward ? "Đã trở về" : "Đang chờ dấu ấn"}</small><strong>{reward.name}</strong><p>{unlockedReward ? reward.note : "Hoàn thành dấu ấn của căn phòng tương ứng để đặt vật này vào vườn."}</p></div></article>;
      })}</div>
    </section>
  );
}
