/** Design system — Nhật ký Mật Ong: phụ đề là một mẩu giấy nhỏ đi cùng giọng Ong, không phải thanh điều khiển phim. */
import { Captions, X } from "lucide-react";
import "./narration-caption.css";

export type ActiveCaption = { cueLabel: string; text: string; index: number; total: number };

export function NarrationCaption({ caption, onDismiss }: { caption: ActiveCaption | null; onDismiss: () => void }) {
  if (!caption) return null;
  return (
    <aside className="narration-caption" aria-live="polite" aria-atomic="true">
      <div className="caption-seal"><Captions size={14} /></div>
      <div><p>Ong kể · {caption.cueLabel} <span>{caption.index}/{caption.total}</span></p><strong>{caption.text}</strong></div>
      <button type="button" onClick={onDismiss} aria-label="Ẩn phụ đề và dừng lời dẫn"><X size={15} /></button>
    </aside>
  );
}
