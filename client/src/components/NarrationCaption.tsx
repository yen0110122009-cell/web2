/** Design system — Nhật ký Mật Ong: phụ đề là mẩu giấy ghim đi cùng giọng Ong, còn bảng cài đặt là nhãn ghi chú nhỏ. */
import { useState } from "react";
import type { CSSProperties } from "react";
import { Captions, ChevronDown, Settings2, X } from "lucide-react";
import type { SubtitleSettings, SubtitleTone } from "@/lib/garden-progress";
import "./narration-caption.css";

export type ActiveCaption = { cueLabel: string; text: string; index: number; total: number };

const TONES: Array<{ key: SubtitleTone; name: string; note: string }> = [
  { key: "honey", name: "Giấy mật", note: "ấm" },
  { key: "moss", name: "Rêu", note: "dịu" },
  { key: "ink", name: "Mực đêm", note: "sẫm" },
];

export function CaptionSettingsPanel({ settings, onChange }: { settings: SubtitleSettings; onChange: (settings: SubtitleSettings) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="caption-settings" aria-label="Cài đặt phụ đề">
      <button type="button" className="caption-settings-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <Settings2 size={14} /> Phụ đề <ChevronDown size={13} className={open ? "turned" : ""} />
      </button>
      {open && <div className="caption-settings-popover">
        <label htmlFor="caption-font-size">Cỡ chữ <b>{Math.round(settings.fontScale * 100)}%</b></label>
        <input id="caption-font-size" type="range" min="0.82" max="1.36" step="0.02" value={settings.fontScale} onChange={(event) => onChange({ ...settings, fontScale: Number(event.target.value) })} />
        <p>Màu dải giấy</p>
        <div className="caption-tone-options">{TONES.map((tone) => <button key={tone.key} type="button" onClick={() => onChange({ ...settings, tone: tone.key })} className={`caption-tone ${tone.key} ${settings.tone === tone.key ? "active" : ""}`} aria-pressed={settings.tone === tone.key}><span /><b>{tone.name}</b><small>{tone.note}</small></button>)}</div>
      </div>}
    </section>
  );
}

export function NarrationCaption({ caption, settings, onDismiss }: { caption: ActiveCaption | null; settings: SubtitleSettings; onDismiss: () => void }) {
  if (!caption) return null;
  const style = { "--caption-scale": settings.fontScale } as CSSProperties;
  return (
    <aside className={`narration-caption tone-${settings.tone}`} style={style} aria-live="polite" aria-atomic="true">
      <div className="caption-seal"><Captions size={14} /></div>
      <div><p>Ong kể · {caption.cueLabel} <span>{caption.index}/{caption.total}</span></p><strong>{caption.text}</strong></div>
      <button type="button" onClick={onDismiss} aria-label="Ẩn phụ đề và dừng lời dẫn"><X size={15} /></button>
    </aside>
  );
}
