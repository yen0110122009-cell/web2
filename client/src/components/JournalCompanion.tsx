/**
 * Design system — Nhật ký Mật Ong:
 * Ba trang giấy ghim cạnh nhau, ưu tiên cảm giác ghi chép thủ công thay vì bảng điều khiển.
 */
import { useMemo, useState } from "react";
import { Archive, BookMarked, Check, Flower2, MailOpen, PenLine, Plus, Sparkles, Sprout, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GardenObservation, GardenPlot, MemoryProgress, TimeOfDay, Weather } from "@/lib/garden-progress";

type ObservationDraft = Pick<GardenObservation, "title" | "note" | "tags">;

type JournalCompanionProps = {
  time: TimeOfDay;
  weather: Weather;
  plots: GardenPlot[];
  memory: MemoryProgress;
  butterflySeen: boolean;
  beeBond: number;
  observations: GardenObservation[];
  specimenKeys: string[];
  openedBeeLetters: string[];
  onCreateObservation: (draft: ObservationDraft) => void;
  onDeleteObservation: (id: string) => void;
  onPinSpecimen: (key: string) => void;
  onOpenLetter: (key: string) => void;
};

const formatDay = (value: string) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(new Date(value));

export default function JournalCompanion({
  time,
  weather,
  plots,
  memory,
  butterflySeen,
  beeBond,
  observations,
  specimenKeys,
  openedBeeLetters,
  onCreateObservation,
  onDeleteObservation,
  onPinSpecimen,
  onOpenLetter,
}: JournalCompanionProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const memoryCount = Object.values(memory).filter((region) => region.status === 3).length;
  const fragmentCount = Object.values(memory).reduce((total, region) => total + region.fragments.length, 0);
  const hasMoonflower = plots.some((plot) => plot.name === "Hoa Mặt Trăng" && (plot.state === "bloom" || plot.state === "mutated"));
  const hasMutation = plots.some((plot) => plot.state === "mutated");

  const specimens = useMemo(() => [
    { key: "star-sunflower", glyph: "✦", title: "Phấn Hướng Dương Sao", label: "biến thể", note: "Một hạt phấn bắt ánh sáng như mực vàng.", unlocked: hasMutation },
    { key: "blue-butterfly", glyph: "✧", title: "Vệt cánh Bướm Xanh", label: "đường bay", note: "Nếp cánh mỏng còn giữ một nhúm phấn mưa.", unlocked: butterflySeen },
    { key: "moonflower-pollen", glyph: "☾", title: "Phấn Hoa Mặt Trăng", label: "mưa đêm", note: "Chỉ nhìn rõ khi khu vườn đã xuống mực đêm.", unlocked: hasMoonflower },
    { key: "three-knocks", glyph: "III", title: "Ba tiếng gõ", label: "manh mối", note: "Một ký hiệu nhỏ Ong để lại dưới hiên nhà.", unlocked: beeBond >= 17 || memory.porch.fragments.includes("bee-three-knocks") },
    { key: "memory-thread", glyph: "⌁", title: "Sợi chỉ ký ức", label: "mảnh ghép", note: "Sợi sáng mảnh nối những điều tưởng không liên quan.", unlocked: fragmentCount >= 3 },
  ], [beeBond, butterflySeen, fragmentCount, hasMoonflower, hasMutation, memory.porch.fragments]);

  const letters = [
    { key: "first-page", date: "Ngày 12", title: "Cậu có nghe đất thở không?", excerpt: "Tớ để lá thư này dưới dấu mật đầu tiên. Đừng đọc vội; trước hết hãy chạm vào đất.", unlocked: true },
    { key: "rain-margin", date: "Khi có mưa", title: "Bên lề sau cơn mưa", excerpt: "Mưa không làm mất dấu vết. Nó chỉ khiến những dấu vết mờ trở nên thành thật hơn.", unlocked: weather === "rain" },
    { key: "butterfly-route", date: "Sau đường bay", title: "Bướm biết một lối tắt", excerpt: "Nếu Bướm xanh ghé qua, đừng vội đuổi theo. Hãy nhìn nơi nó không chịu đậu.", unlocked: butterflySeen },
    { key: "memory-wax", date: "Khi có hai ký ức", title: "Dấu sáp không phải để khóa", excerpt: "Có vài trang được dán lại để cậu mở chúng vào đúng lúc, chứ không phải để giấu đi mãi.", unlocked: memoryCount >= 2 },
    { key: "door-name", date: "Khi đủ năm ký ức", title: "Tên của cánh cửa", excerpt: "Nó không có tên vì đang chờ được cậu gọi đúng. Tớ đã nhớ ra một nửa đường về.", unlocked: memoryCount >= 5 },
  ];

  const prompt = time === "night"
    ? weather === "rain" ? "Mưa đêm đang nói gì với đất?" : "Có điều gì đổi khác khi vườn lên mực đêm?"
    : weather === "rain" ? "Hôm nay, mưa đã để lại dấu vết nào?" : "Bông hoa nào khiến cậu dừng lại lâu nhất?";

  function submitObservation() {
    const normalizedTitle = title.trim();
    const normalizedNote = note.trim();
    if (!normalizedTitle || !normalizedNote) return;
    onCreateObservation({ title: normalizedTitle, note: normalizedNote, tags: [time === "night" ? "Mực đêm" : "Ngày trong", weather === "rain" ? "Mưa" : "Đất ấm"] });
    setTitle("");
    setNote("");
  }

  return (
    <section className="journal-companion" aria-label="Ba trang đã ghim trong sổ tay">
      <div className="journal-companion-head">
        <div><p className="eyebrow">Ba trang đã ghim</p><h3>Những điều khu vườn nhờ bạn giữ lại</h3></div>
        <span className="paper-index">01–03</span>
      </div>
      <Tabs defaultValue="observe" className="honey-journal-tabs">
        <TabsList className="journal-tab-list" aria-label="Các trang trong Sổ tay">
          <TabsTrigger value="observe" className="journal-tab"><PenLine size={15} /> Quan sát</TabsTrigger>
          <TabsTrigger value="specimens" className="journal-tab"><Archive size={15} /> Mẫu vật</TabsTrigger>
          <TabsTrigger value="letters" className="journal-tab"><MailOpen size={15} /> Thư của Ong</TabsTrigger>
        </TabsList>

        <TabsContent value="observe" className="journal-tab-page observation-page">
          <div className="observation-composer">
            <div className="composer-margin"><span>Ghi chú<br />thực địa</span><i>✦</i></div>
            <div className="composer-body">
              <p className="journal-prompt">“{prompt}”</p>
              <label htmlFor="observation-title">Tên một điều vừa thấy</label>
              <input id="observation-title" value={title} maxLength={64} onChange={(event) => setTitle(event.target.value)} placeholder="Ví dụ: Vệt sáng trong nhụy hoa" />
              <label htmlFor="observation-note">Điều Ong nên nhớ</label>
              <textarea id="observation-note" value={note} maxLength={360} onChange={(event) => setNote(event.target.value)} placeholder="Viết ngắn thôi, như một nét bút chì trên mép trang…" rows={3} />
              <button className="journal-save-button" onClick={submitObservation} disabled={!title.trim() || !note.trim()}><Plus size={16} /> Ghép vào trang hôm nay</button>
            </div>
          </div>
          <div className="observation-ledger" aria-live="polite">
            {observations.length ? [...observations].reverse().map((observation) => (
              <article className="observation-slip" key={observation.id}>
                <div className="slip-pin" aria-hidden="true" /><div className="slip-meta">{formatDay(observation.createdAt)} · {observation.time === "night" ? "Đêm" : "Ngày"} · {observation.weather === "rain" ? "Mưa" : "Trong"}</div>
                <h4>{observation.title}</h4><p>{observation.note}</p>
                <div className="slip-foot"><div>{observation.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button onClick={() => onDeleteObservation(observation.id)} aria-label={`Gỡ ghi chép ${observation.title}`}><Trash2 size={14} /></button></div>
              </article>
            )) : <div className="journal-empty"><BookMarked size={21} /><p>Trang này đang chờ một điều rất nhỏ mà chỉ bạn để ý.</p></div>}
          </div>
        </TabsContent>

        <TabsContent value="specimens" className="journal-tab-page specimen-page">
          <div className="specimen-intro"><div><p className="journal-prompt">Mẫu vật không phải để sở hữu. Chúng là lý do để nhìn kỹ hơn.</p><small>{specimenKeys.length} / {specimens.length} mẫu đã ghim vào album</small></div><Sprout size={27} /></div>
          <div className="specimen-album-grid">
            {specimens.map((specimen) => {
              const pinned = specimenKeys.includes(specimen.key);
              return <article key={specimen.key} className={`album-specimen ${specimen.unlocked ? "is-found" : "is-locked"} ${pinned ? "is-pinned" : ""}`}>
                <div className="specimen-seal">{specimen.unlocked ? specimen.glyph : "?"}</div><div><p>{specimen.label}</p><h4>{specimen.unlocked ? specimen.title : "Mẫu vật chưa gọi tên"}</h4><span>{specimen.unlocked ? specimen.note : "Khu vườn vẫn đang giữ nó ở một góc chưa mở."}</span></div>
                {specimen.unlocked && <button onClick={() => onPinSpecimen(specimen.key)} disabled={pinned}>{pinned ? <><Check size={14} /> Đã ghim</> : <><Flower2 size={14} /> Ghim vào album</>}</button>}
              </article>;
            })}
          </div>
        </TabsContent>

        <TabsContent value="letters" className="journal-tab-page letters-page">
          <div className="letter-stack" aria-label="Các lá thư của Ong">
            {letters.map((letter, index) => {
              const opened = openedBeeLetters.includes(letter.key);
              return <article className={`bee-letter ${letter.unlocked ? "is-unsealed" : "is-sealed"} ${opened ? "is-read" : ""}`} key={letter.key}>
                <div className="letter-number">0{index + 1}</div><div className="letter-copy"><p>{letter.date}</p><h4>{letter.unlocked ? letter.title : "Một phong bì dán sáp"}</h4><span>{letter.unlocked ? letter.excerpt : "Trang này sẽ tự hé khi khu vườn ghi nhận đúng dấu vết."}</span></div>
                {letter.unlocked ? <button onClick={() => onOpenLetter(letter.key)}>{opened ? <><Check size={15} /> Đã đọc</> : <><MailOpen size={15} /> Mở thư</>}</button> : <span className="letter-wax"><Sparkles size={15} /></span>}
              </article>;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
