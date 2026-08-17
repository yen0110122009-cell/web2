/**
 * Design system — Nhật ký Mật Ong:
 * Mỗi cây đột biến là một mẫu vật còn sống trên trang sổ, luôn có một cử động chậm để gợi rằng nó đang nhớ.
 */
import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { gardenAsset } from "@/lib/public-assets";
import "./mutation-gallery.css";

const MUTATIONS = [
  { id: "moon-tulip", name: "Tulip Ánh Trăng", condition: "Đêm trong · một lượt tưới", cue: "Cánh hoa giữ lại ánh trăng như một giọt nước.", image: gardenAsset("mutation-moon-tulip_2246502f.jpg"), className: "moon" },
  { id: "star-sunflower", name: "Hướng Dương Sao", condition: "Mưa đêm · may mắn", cue: "Nhị hoa phát sáng khi Ong bay ba vòng.", image: gardenAsset("mutation-star-sunflower_be2ec40d.jpg"), className: "star" },
  { id: "rain-rose", name: "Hoa Hồng Mưa", condition: "Mưa ngày · phấn hoa", cue: "Mỗi giọt mưa giữ một màu khác nhau trong cánh.", image: gardenAsset("mutation-rain-rose_1bc8a434.jpg"), className: "rain" },
  { id: "inverted-clover", name: "Cỏ Ba Lá Ngược", condition: "Đất mới · bướm xanh", cue: "Ba lá cùng ngước lên, như đang lắng nghe đất thở.", image: gardenAsset("mutation-inverted-clover_7d21da73.jpg"), className: "clover" },
  { id: "nameless-seed", name: "Cây Không Tên", condition: "Mưa đêm · chờ một nhịp", cue: "Nó không biến đổi; nó thôi giả vờ là bình thường.", image: gardenAsset("mutation-herbarium-reference_dc0c607d.jpg"), className: "nameless" },
];

export default function MutationGallery() {
  const [selected, setSelected] = useState("star-sunflower");
  const active = MUTATIONS.find((mutation) => mutation.id === selected) ?? MUTATIONS[0];
  return <section className="mutation-gallery" aria-label="Các cây đột biến">
    <header><div><p className="eyebrow">Mẫu vật còn sống</p><h3>Những cây không còn giống hôm qua</h3></div><span className="mutation-index"><Sparkles size={14} /> 05 biến thể</span></header>
    <div className="mutation-shelf">{MUTATIONS.map((mutation) => <button key={mutation.id} onClick={() => setSelected(mutation.id)} className={`mutation-card ${mutation.className} ${selected === mutation.id ? "selected" : ""}`}><span className="mutation-image"><img src={mutation.image} alt={`Minh họa ${mutation.name}`} /></span><span className="mutation-card-copy"><small>{mutation.condition}</small><strong>{mutation.name}</strong></span></button>)}</div>
    <div className={`mutation-detail ${active.className}`}><div className="detail-illustration"><img src={active.image} alt="" /></div><div><p className="eyebrow">Ghi chú từ Ong</p><h4>{active.name}</h4><p>{active.cue}</p><span className="detail-condition">Điều kiện: {active.condition}</span><button onClick={() => setSelected((current) => current)} className="detail-action">Ghim vào trang hôm nay <ChevronRight size={15} /></button></div></div>
  </section>;
}
