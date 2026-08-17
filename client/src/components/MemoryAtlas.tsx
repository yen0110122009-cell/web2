/**
 * Design system — Nhật ký Mật Ong:
 * Bản đồ ký ức là giấy vẽ tay đang tự hiện ra, không phải bảng nhiệm vụ hay dashboard thành tích.
 */
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CloudRain,
  Ear,
  Flower2,
  FlipHorizontal2,
  KeyRound,
  LockKeyhole,
  Moon,
  Music2,
  RotateCcw,
  Sparkles,
  Sprout,
  Sun,
  Volume2,
  Waves,
} from "lucide-react";
import { toast } from "sonner";
import type { MemoryProgress, RegionKey, TimeOfDay, Weather } from "@/lib/garden-progress";
import "./memory-atlas.css";

type Chime = "soft" | "magic" | "wrong";

type MemoryAtlasProps = {
  progress: MemoryProgress;
  onProgressChange: (next: MemoryProgress) => void;
  onRegionUnderstood: (region: RegionKey) => void;
  onNarrate: (region: RegionKey) => void;
  time: TimeOfDay;
  weather: Weather;
  onTimeChange: (time: TimeOfDay) => void;
  onWeatherChange: (weather: Weather) => void;
  onChime: (kind: Chime) => void;
};

const REGION_INFO: Record<RegionKey, { order: string; name: string; glyph: string; question: string; ambience: string; tone: string }> = {
  porch: { order: "01", name: "Hiên Mật Ong", glyph: "◒", question: "Ong đã từng ngủ ở đâu?", ambience: "Gỗ ấm, hương mật cũ", tone: "amber" },
  seed: { order: "02", name: "Vườn Hạt Cuối Cùng", glyph: "✦", question: "Vì sao cây đột biến tồn tại?", ambience: "Đất nhớ mưa và đêm", tone: "verdant" },
  lake: { order: "03", name: "Hồ Phản Chiếu", glyph: "◌", question: "Người làm vườn đã rời đi thế nào?", ambience: "Ba mặt nước, một bóng cửa", tone: "silver" },
  hive: { order: "04", name: "Tổ Ong Rỗng", glyph: "⌂", question: "Vì sao Ong khóa cửa?", ambience: "Bảy âm thanh còn lại", tone: "honey" },
  room: { order: "05", name: "Căn Phòng Không Có Tường", glyph: "◇", question: "Bạn sẽ làm gì với sự thật?", ambience: "Năm khoảnh khắc trôi", tone: "mist" },
};

const REGION_KEYS: RegionKey[] = ["porch", "seed", "lake", "hive", "room"];
const PORCH_LEAVES = ["tulip", "sunflower", "rose", "clover", "moon", "nameless", "veinless"];
const PORCH_JARS = ["tulip", "sunflower", "rose", "clover", "moon", "nameless", "veinless"];
const PORCH_LABELS: Record<string, string> = { tulip: "Tulip", sunflower: "Hướng Dương", rose: "Hoa Hồng", clover: "Cỏ Ba Lá", moon: "Hoa Mặt Trăng", nameless: "Không Tên", veinless: "Không Nhãn" };
const HIVE_SOUNDS = ["Hạt rơi", "Cánh Bướm", "Thìa chạm lọ", "Mưa", "Kéo gãy", "Cửa đóng", "Khoảng lặng"];
const HIVE_ORDER = ["Hạt rơi", "Cánh Bướm", "Thìa chạm lọ", "Mưa", "Kéo gãy", "Cửa đóng", "Khoảng lặng"];
const ROOM_CARDS = ["Hạt được gieo", "Ong được gọi tên", "Cây đầu tiên nở", "Người làm vườn rời đi", "Cánh cửa được khóa"];

function statusLabel(status: number) {
  return ["Chưa nhớ", "Có dấu vết", "Đã nối lại", "Đã hiểu"][status] ?? "Chưa nhớ";
}

function statusClass(status: number) {
  return ["fog", "trace", "joined", "understood"][status] ?? "fog";
}

export default function MemoryAtlas({ progress, onProgressChange, onRegionUnderstood, onNarrate, time, weather, onTimeChange, onWeatherChange, onChime }: MemoryAtlasProps) {
  const [activeRoom, setActiveRoom] = useState<RegionKey | null>(null);
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);
  const [selectedSeed, setSelectedSeed] = useState<"sun" | "rain" | "night" | "nameless">("sun");
  const [departureFlipped, setDepartureFlipped] = useState(false);

  const seals = useMemo(() => REGION_KEYS.filter((key) => progress[key].status === 3).length, [progress]);
  const coreFragments = useMemo(() => REGION_KEYS.reduce((total, key) => total + progress[key].fragments.length, 0), [progress]);
  const recollection = Math.round((seals * 0.72 + Math.min(coreFragments / 15, 1) * 0.28) * 100);

  const unlocked = (key: RegionKey) => {
    if (key === "porch") return true;
    if (key === "seed") return progress.porch.status >= 2;
    if (key === "lake") return progress.seed.status >= 2;
    if (key === "hive") return progress.lake.status >= 2;
    const prerequisites: RegionKey[] = ["porch", "seed", "lake", "hive"];
    return prerequisites.every((region) => progress[region].status === 3);
  };

  function patchRegion(key: RegionKey, patch: Partial<MemoryProgress[RegionKey]>) {
    onProgressChange({ ...progress, [key]: { ...progress[key], ...patch } });
  }

  function markVisited(key: RegionKey) {
    if (progress[key].status === 0) patchRegion(key, { status: 1 });
  }

  function addStep(key: RegionKey, step: string, fragment?: string) {
    const region = progress[key];
    if (region.steps.includes(step)) return;
    patchRegion(key, {
      status: Math.max(region.status, 2) as 0 | 1 | 2 | 3,
      steps: [...region.steps, step],
      fragments: fragment && !region.fragments.includes(fragment) ? [...region.fragments, fragment] : region.fragments,
    });
  }

  function completeRegion(key: RegionKey, fragments: string[], message: string) {
    if (progress[key].status === 3) return;
    onProgressChange({
      ...progress,
      [key]: {
        status: 3,
        steps: Array.from(new Set([...progress[key].steps, "understood"])),
        fragments: Array.from(new Set([...progress[key].fragments, ...fragments])),
      },
    });
    onChime("magic");
    onRegionUnderstood(key);
    toast("Một dấu ấn vừa ấm lên", { description: message });
  }

  function openRoom(key: RegionKey) {
    if (!unlocked(key)) {
      onChime("wrong");
      toast("Nơi này vẫn đang được tạo ra", { description: "Khu vườn cần một dấu vết ở phòng trước trước khi nhớ được nơi này." });
      return;
    }
    markVisited(key);
    setActiveRoom(key);
    onChime("soft");
    onNarrate(key);
  }

  function selectPorchJar(jar: string) {
    if (!selectedLeaf) {
      toast("Chọn một chiếc lá trước", { description: "Những đường gân lá đang kể tên của từng lọ." });
      return;
    }
    if (selectedLeaf !== jar) {
      onChime("wrong");
      toast("Mật trong lọ chỉ mờ đi", { description: "Ong khẽ nói: “Hãy nghe đường gân của chiếc lá.”" });
      setSelectedLeaf(null);
      return;
    }
    const step = `porch:${jar}`;
    addStep("porch", step, jar === "veinless" ? "porch-label" : undefined);
    onChime("soft");
    setSelectedLeaf(null);
    if (progress.porch.steps.filter((entry) => entry.startsWith("porch:")).length + 1 === PORCH_JARS.length) {
      completeRegion("porch", ["porch-image", "porch-sound", "porch-label"], "Lọ Không Nhãn hóa bạc. Ong từng ngủ dưới chiếc ghế ở hiên này.");
    }
  }

  function sowSeed(bed: "sun" | "rain" | "night" | "centre") {
    const region = progress.seed;
    const correct: Record<string, { seed: string; valid: boolean; step: string; fragment: string }> = {
      sun: { seed: "sun", valid: time === "day" && weather === "clear", step: "seed:sun", fragment: "seed-sun" },
      rain: { seed: "rain", valid: time === "day" && weather === "rain", step: "seed:rain", fragment: "seed-rain" },
      night: { seed: "night", valid: time === "night" && weather === "clear", step: "seed:night", fragment: "seed-night" },
      centre: { seed: "nameless", valid: time === "night" && weather === "rain", step: "seed:nameless", fragment: "seed-nameless" },
    };
    const rule = correct[bed];
    if (selectedSeed !== rule.seed || !rule.valid) {
      onChime("wrong");
      toast("Hạt nằm yên trong đất", { description: "Không phải hạt nào cũng muốn được đánh thức cùng một lúc." });
      return;
    }
    addStep("seed", rule.step, rule.fragment);
    onChime("soft");
    if (bed === "centre") {
      toast("Hạt Không Tên đã nghe thấy mưa đêm", { description: "Đừng ép nó nở. Hãy rời mắt đi một nhịp." });
    } else {
      toast("Một luống đất vừa sáng lên", { description: "Biểu tượng ở giữa đang dần hoàn chỉnh." });
    }
    if (region.steps.includes("seed:nameless")) return;
  }

  function tendNamelessSeed() {
    if (!progress.seed.steps.includes("seed:nameless")) {
      toast("Khoảng trống chưa có hạt", { description: "Hãy để mưa đêm dẫn Hạt Không Tên đến trước." });
      return;
    }
    completeRegion("seed", ["seed-sun", "seed-rain", "seed-night", "seed-nameless"], "Cây Không Tên không biến đổi; nó chỉ thôi giả vờ là một cái cây bình thường.");
  }

  function lookIntoLake() {
    const order: Array<{ label: string; matches: boolean; fragment: string }> = [
      { label: "day", matches: time === "day" && weather === "clear", fragment: "lake-first" },
      { label: "rain", matches: time === "day" && weather === "rain", fragment: "lake-letter" },
      { label: "night", matches: time === "night", fragment: "lake-shadow" },
    ];
    const done = progress.lake.steps.filter((step) => step.startsWith("lake:")).length;
    const expected = order[done];
    if (!expected) return;
    if (!expected.matches) {
      onChime("wrong");
      toast("Mặt hồ chỉ thở dài", { description: "Bướm xanh bay gần vòng gợn khác, như muốn chỉ một thời điểm khác." });
      return;
    }
    addStep("lake", `lake:${expected.label}`, expected.fragment);
    onChime("soft");
    toast("Một vòng gợn giữ lại hình ảnh", { description: expected.label === "night" ? "Bóng của Ong đứng một mình dưới mưa." : "Ký ức hiện lên rồi tan như sương." });
  }

  function placeLakeKey() {
    if (progress.lake.steps.filter((step) => step.startsWith("lake:")).length < 3) {
      toast("Bóng cửa còn chưa đủ rõ", { description: "Hãy nhìn xuống hồ dưới ba trạng thái khác nhau." });
      return;
    }
    completeRegion("lake", ["lake-first", "lake-key", "lake-letter", "lake-shadow"], "Chìa khóa không mở cửa; nó ghi nhớ người đã chạm vào nó.");
  }

  function addHiveSound(sound: string) {
    const picked = progress.hive.steps.filter((step) => step.startsWith("hive:")).map((step) => step.replace("hive:", ""));
    if (picked.includes(sound)) return;
    addStep("hive", `hive:${sound}`, sound === "Hạt rơi" ? "hive-seed" : sound === "Kéo gãy" ? "hive-cut" : undefined);
    onChime(sound === "Khoảng lặng" ? "soft" : "magic");
  }

  function checkHiveSequence() {
    const picked = progress.hive.steps.filter((step) => step.startsWith("hive:")).map((step) => step.replace("hive:", ""));
    if (picked.length !== HIVE_ORDER.length) {
      toast("Chuỗi còn thiếu một khoảng", { description: "Có bảy ô tổ, nhưng chỉ sáu ô phát âm thanh." });
      return;
    }
    if (picked.every((sound, index) => sound === HIVE_ORDER[index])) {
      completeRegion("hive", ["hive-seed", "hive-wing", "hive-cut", "hive-door", "hive-silence"], "Khoảng lặng là phần Ong từng bỏ qua trong mọi lần kể chuyện.");
      return;
    }
    onChime("wrong");
    toast("Nhịp tổ ong tan ra rồi", { description: "Không mất dấu vết nào. Hãy thử nghe lại một ngày cuối cùng." });
    patchRegion("hive", { steps: progress.hive.steps.filter((step) => !step.startsWith("hive:")) });
  }

  function addRoomCard(card: string) {
    const picked = progress.room.steps.filter((step) => step.startsWith("room:")).map((step) => step.replace("room:", ""));
    if (picked.includes(card)) return;
    addStep("room", `room:${card}`, card === "Hạt được gieo" ? "room-seed" : card === "Ong được gọi tên" ? "room-name" : undefined);
    onChime("soft");
  }

  function stitchDay() {
    const picked = progress.room.steps.filter((step) => step.startsWith("room:")).map((step) => step.replace("room:", ""));
    if (picked.length !== ROOM_CARDS.length || !picked.every((card, index) => card === ROOM_CARDS[index])) {
      toast("Ngày này vẫn chưa liền mạch", { description: "Các tấm kính không trách bạn. Chúng chỉ trôi về vị trí cũ." });
      return;
    }
    completeRegion("room", ["room-seed", "room-name", "room-departure", "room-choice", "room-truth"], departureFlipped ? "Bạn đã chọn nhớ sự ra đi như một cái nhìn quay lại." : "Bạn đã để lại hai cách hiểu cùng tồn tại trong một ngày.");
  }

  function resetRoomPuzzle(key: RegionKey) {
    if (key === "porch") return;
    const prefix = key === "seed" ? "seed:" : key === "lake" ? "lake:" : key === "hive" ? "hive:" : "room:";
    patchRegion(key, { steps: progress[key].steps.filter((step) => !step.startsWith(prefix)) });
    onChime("soft");
  }

  const room = activeRoom ? REGION_INFO[activeRoom] : REGION_INFO.porch;
  const porchMatched = progress.porch.steps.filter((step) => step.startsWith("porch:")).map((step) => step.replace("porch:", ""));
  const seedSteps = progress.seed.steps;
  const lakeCount = progress.lake.steps.filter((step) => step.startsWith("lake:")).length;
  const hivePicked = progress.hive.steps.filter((step) => step.startsWith("hive:")).map((step) => step.replace("hive:", ""));
  const roomPicked = progress.room.steps.filter((step) => step.startsWith("room:")).map((step) => step.replace("room:", ""));

  if (!activeRoom) {
    return (
      <section className="memory-atlas" aria-label="Bản đồ ký ức">
        <header className="atlas-heading">
          <div><p className="eyebrow">Sau cánh cửa · trang tự lưu</p><h2>Bản đồ của những điều Ong đã quên</h2></div>
          <div className="atlas-seal"><span>✧</span><strong>{seals} / 5</strong><small>dấu ấn</small></div>
        </header>
        <div className="atlas-map-paper">
          <div className="atlas-map-caption"><p>“Ký ức không nằm yên một chỗ.”</p><span>— Ong</span></div>
          <div className="atlas-door"><span className="atlas-door-knob" /></div>
          <div className="atlas-route route-one" /><div className="atlas-route route-two" /><div className="atlas-route route-three" />
          <div className="region-orbit">
            {REGION_KEYS.map((key) => {
              const info = REGION_INFO[key];
              const region = progress[key];
              return <button key={key} className={`atlas-region ${info.tone} ${statusClass(region.status)} ${!unlocked(key) ? "locked" : ""}`} onClick={() => openRoom(key)}>
                <span className="region-seal">{region.status === 3 ? "✧" : info.glyph}</span>
                <span className="region-copy"><small>{info.order} · {statusLabel(region.status)}</small><strong>{info.name}</strong><em>{info.question}</em></span>
                {!unlocked(key) && <LockKeyhole size={14} />}
              </button>;
            })}
          </div>
        </div>
        <footer className="atlas-measures">
          <div><span>✧</span><strong>{seals} / 5</strong><small>dấu ấn đã ấm</small></div>
          <div><span>◆</span><strong>{coreFragments}</strong><small>mảnh đang ở trong sổ</small></div>
          <div><span>◌</span><strong>{recollection}%</strong><small>khu vườn đang nhớ lại</small></div>
        </footer>
      </section>
    );
  }

  return (
    <section className={`memory-room ${room.tone}`} aria-label={`Phòng ký ức ${room.name}`}>
      <header className="memory-room-header">
        <button className="room-back" onClick={() => setActiveRoom(null)}><ArrowLeft size={16} /> Bản đồ ký ức</button>
        <div><p>{room.order} · {statusLabel(progress[activeRoom].status)}</p><h2>{room.name}</h2></div>
        <button className="room-sound" onClick={() => { onChime("soft"); onNarrate(activeRoom); toast("Ong khẽ dẫn chuyện", { description: room.ambience }); }}><Volume2 size={17} /><span>Nghe Ong</span></button>
      </header>

      {activeRoom === "porch" && <div className={`puzzle-stage porch-stage ${porchMatched.length === 7 ? "is-silver" : ""}`}>
        <div className="scene-note"><span>Gỗ ấm · lọ cũ</span><p>“Tôi đã không còn dùng hiên này từ rất lâu.”</p></div>
        <div className="porch-jars">
          {PORCH_JARS.map((jar) => <button key={jar} className={`memory-jar ${porchMatched.includes(jar) ? "matched" : ""}`} onClick={() => selectPorchJar(jar)}><span className="jar-lid" /><span className="jar-honey" /><small>{PORCH_LABELS[jar]}</small></button>)}
        </div>
        <div className="porch-leaves">
          {PORCH_LEAVES.map((leaf) => <button key={leaf} className={`memory-leaf leaf-${leaf} ${selectedLeaf === leaf ? "selected" : ""} ${porchMatched.includes(leaf) ? "matched" : ""}`} onClick={() => !porchMatched.includes(leaf) && setSelectedLeaf(leaf)} aria-label={`Chọn lá ${PORCH_LABELS[leaf]}`}><span>{leaf === "veinless" ? "◐" : "❧"}</span><small>{PORCH_LABELS[leaf]}</small></button>)}
        </div>
        <div className="puzzle-caption"><div><Sparkles size={15} /><span>{porchMatched.length} / 7 cặp đã đặt cạnh nhau</span></div><p>{porchMatched.length === 7 ? "Lọ Không Nhãn hóa bạc. Một ký ức đã được gọi tên." : "Chọn một lá, rồi đặt nó cạnh lọ đang nhớ nó."}</p></div>
      </div>}

      {activeRoom === "seed" && <div className={`puzzle-stage seed-stage ${time === "night" ? "is-night" : ""} ${weather === "rain" ? "is-rain" : ""}`}>
        <div className="seed-weather-controls"><p>Điều kiện đang có: <strong>{time === "day" ? "Ngày" : "Đêm"} · {weather === "rain" ? "Mưa" : "Trong"}</strong></p><div><button onClick={() => onTimeChange("day")} className={time === "day" ? "active" : ""}><Sun size={14} /> Ngày</button><button onClick={() => onTimeChange("night")} className={time === "night" ? "active" : ""}><Moon size={14} /> Đêm</button><button onClick={() => onWeatherChange(weather === "rain" ? "clear" : "rain")} className={weather === "rain" ? "active" : ""}><CloudRain size={14} /> Mưa</button></div></div>
        <div className="seed-choice"><span>Chọn hạt:</span>{(["sun", "rain", "night", "nameless"] as const).map((seed) => <button className={selectedSeed === seed ? "selected" : ""} key={seed} onClick={() => setSelectedSeed(seed)}>{seed === "sun" ? "Hướng Dương" : seed === "rain" ? "Hoa Hồng" : seed === "night" ? "Tulip" : "Không Tên"}</button>)}</div>
        <div className="seed-beds">
          <button className={`seed-bed sun ${seedSteps.includes("seed:sun") ? "grown" : ""}`} onClick={() => sowSeed("sun")}><span>☀</span><strong>Luống Nắng</strong><small>Ngày · trời trong</small></button>
          <button className={`seed-bed rain ${seedSteps.includes("seed:rain") ? "grown" : ""}`} onClick={() => sowSeed("rain")}><span>☂</span><strong>Luống Mưa</strong><small>Ngày · có mưa</small></button>
          <button className={`seed-bed night ${seedSteps.includes("seed:night") ? "grown" : ""}`} onClick={() => sowSeed("night")}><span>☾</span><strong>Luống Đêm</strong><small>Đêm · trời trong</small></button>
          <button className={`seed-bed nameless ${seedSteps.includes("seed:nameless") ? "grown" : ""}`} onClick={() => sowSeed("centre")}><span>✧</span><strong>Khoảng trống</strong><small>Mưa đêm · Không Tên</small></button>
        </div>
        <div className="puzzle-caption"><div><Sprout size={15} /><span>{seedSteps.filter((step) => step.startsWith("seed:")).length} / 4 hạt đã nhớ điều kiện</span></div><button className="memory-action" onClick={tendNamelessSeed}>Rời mắt một nhịp <ChevronRight size={15} /></button></div>
      </div>}

      {activeRoom === "lake" && <div className={`puzzle-stage lake-stage lake-${lakeCount}`}>
        <div className="lake-conditions" aria-label="Điều khiển trạng thái mặt hồ">
          <div><span>Trạng thái mặt hồ</span><strong>{time === "day" ? "Ngày" : "Đêm"} · {weather === "rain" ? "Mưa" : "Trong"}</strong></div>
          <div className="lake-condition-actions"><button onClick={() => onTimeChange("day")} className={time === "day" ? "active" : ""}><Sun size={14} /> Ngày</button><button onClick={() => onTimeChange("night")} className={time === "night" ? "active" : ""}><Moon size={14} /> Đêm</button><button onClick={() => onWeatherChange(weather === "rain" ? "clear" : "rain")} className={weather === "rain" ? "active" : ""}><CloudRain size={14} /> {weather === "rain" ? "Trong" : "Mưa"}</button></div>
        </div>
        <div className="lake-scene"><span className="lake-moon" /><span className="lake-ripple ripple-one" /><span className="lake-ripple ripple-two" /><span className="lake-butterfly">✧</span><button className="lake-look" onClick={lookIntoLake}><Waves size={17} /> Nhìn xuống hồ</button>{lakeCount >= 3 && <button className="lake-key" onClick={placeLakeKey}><KeyRound size={17} /> Đưa chìa khóa vào bóng cửa</button>}</div>
        <div className="lake-times"><span className={lakeCount >= 1 ? "seen" : ""}>01 · Ngày</span><span className={lakeCount >= 2 ? "seen" : ""}>02 · Mưa</span><span className={lakeCount >= 3 ? "seen" : ""}>03 · Đêm</span></div>
        <div className="puzzle-caption lake-caption"><div><Waves size={15} /><span>{lakeCount} / 3 vòng gợn đã giữ lại một cảnh</span></div><p>{lakeCount === 3 ? "Ba hình ảnh đang chồng lên nhau. Chìa khóa thuộc về bóng cửa, không phải cánh cửa thật." : "Theo thứ tự: Ngày · Trong → Ngày · Mưa → Đêm. Mỗi trạng thái chỉ cần nhìn một lần."}</p><button className="lake-reset" onClick={() => resetRoomPuzzle("lake")}><RotateCcw size={14} /> Đặt lại</button></div>
      </div>}

      {activeRoom === "hive" && <div className="puzzle-stage hive-stage">
        <div className="hive-intro"><p>“Tôi đã giữ những tiếng này lâu đến mức tưởng chúng là tiếng của mình.”</p><button onClick={() => resetRoomPuzzle("hive")}><RotateCcw size={15} /> Đặt lại nhịp</button></div>
        <div className="hive-cells">{HIVE_SOUNDS.map((sound, index) => <button key={sound} className={`hive-cell ${hivePicked.includes(sound) ? "picked" : ""} ${sound === "Khoảng lặng" ? "silence" : ""}`} onClick={() => addHiveSound(sound)}><span>{hivePicked.includes(sound) ? hivePicked.indexOf(sound) + 1 : index + 1}</span><strong>{sound === "Khoảng lặng" ? "" : sound}</strong><small>{sound === "Khoảng lặng" ? "· · ·" : "chạm để nghe"}</small></button>)}</div>
        <div className="hive-sequence">{hivePicked.length ? hivePicked.map((sound) => <span key={sound}>{sound}</span>) : <em>Những tiếng bạn chọn sẽ nằm ở đây, theo trật tự bạn nghe thấy.</em>}</div>
        <div className="puzzle-caption"><div><Ear size={15} /><span>{hivePicked.length} / 7 ô tổ đã được gọi</span></div><button className="memory-action" onClick={checkHiveSequence}>Nối âm thanh <Music2 size={15} /></button></div>
      </div>}

      {activeRoom === "room" && <div className="puzzle-stage room-stage">
        <div className="room-floating-note"><p>Không có tường, sàn hay trần. Chỉ có năm khoảnh khắc đang tìm đường về với nhau.</p><button onClick={() => resetRoomPuzzle("room")}><RotateCcw size={14} /> Thả các mảnh ra</button></div>
        <div className="timeline-glass">{ROOM_CARDS.map((card, index) => <button key={card} className={`glass-memory card-${index + 1} ${roomPicked.includes(card) ? "placed" : ""} ${card === "Người làm vườn rời đi" && departureFlipped ? "flipped" : ""}`} onClick={() => addRoomCard(card)}><span>{index + 1}</span><strong>{card}</strong>{card === "Người làm vườn rời đi" && <i onClick={(event) => { event.stopPropagation(); setDepartureFlipped((value) => !value); }}><FlipHorizontal2 size={14} /> {departureFlipped ? "quay lại nhìn" : "lật mảnh"}</i>}</button>)}</div>
        <div className="timeline-thread">{roomPicked.length ? roomPicked.map((card) => <span key={card}>{card}</span>) : <em>Chạm từng tấm kính theo thứ tự một ngày đã xảy ra.</em>}</div>
        <div className="puzzle-caption"><div><Flower2 size={15} /><span>{roomPicked.length} / 5 khoảnh khắc đã xếp</span></div><button className="memory-action" onClick={stitchDay}>Ghép ngày này lại <Check size={15} /></button></div>
      </div>}

      <footer className="room-fragment-strip"><div><span>✧</span><p><strong>{progress[activeRoom].fragments.length} mảnh</strong> đã ở trong sổ</p></div><button onClick={() => setActiveRoom(null)}>Rời căn phòng <ChevronRight size={15} /></button></footer>
    </section>
  );
}
