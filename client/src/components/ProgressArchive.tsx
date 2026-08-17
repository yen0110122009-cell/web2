/**
 * Design system — Nhật ký Mật Ong:
 * Hộp lưu trữ là phong bì giấy thực địa, chỉ thực hiện các thao tác sao lưu do người chơi chủ động chọn.
 */
import { useRef, useState } from "react";
import { Download, FileUp, FolderArchive, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { parseGardenBackup, serializeGardenBackup, type GardenProgressSnapshot } from "@/lib/garden-progress";
import "./progress-archive.css";

type ProgressArchiveProps = {
  snapshot: GardenProgressSnapshot;
  onImport: (snapshot: GardenProgressSnapshot) => void;
};

export default function ProgressArchive({ snapshot, onImport }: ProgressArchiveProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);

  function exportBackup() {
    const blob = new Blob([serializeGardenBackup(snapshot)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vuon-nho-cua-ong-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    toast("Đã cất một trang sao lưu", { description: "Hãy giữ tệp JSON này ở nơi bạn dễ tìm lại." });
  }

  async function importBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsReading(true);
    const result = parseGardenBackup(await file.text());
    setIsReading(false);
    if ("error" in result) {
      toast("Chưa thể mở phong bì", { description: result.error });
      return;
    }
    onImport(result.snapshot);
    toast("Khu vườn đã nhớ lại", { description: "Tiến trình trong tệp vừa thay thế trang ghi chép hiện tại." });
  }

  return (
    <section className="progress-archive" aria-label="Sao lưu tiến trình">
      <div className="archive-seal"><FolderArchive size={19} /><span>03</span></div>
      <div className="archive-copy"><p>Hộp lưu trữ</p><h3>Giữ lại đường về của khu vườn</h3><small><ShieldCheck size={13} /> Tệp JSON chỉ được đọc khi bạn tự chọn.</small></div>
      <div className="archive-actions">
        <button onClick={exportBackup}><Download size={15} /> Xuất tệp</button>
        <button onClick={() => inputRef.current?.click()} disabled={isReading}><FileUp size={15} /> {isReading ? "Đang đọc…" : "Nhập tệp"}</button>
        <input ref={inputRef} className="archive-file-input" type="file" accept="application/json,.json" onChange={importBackup} />
      </div>
    </section>
  );
}
