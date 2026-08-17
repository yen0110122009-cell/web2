/**
 * Design system — Nhật ký Mật Ong:
 * nền giấy ngà, nét mực xanh rêu, hổ phách là màu xác nhận, và mực đêm chỉ dành cho ký ức bí ẩn.
 * Khu vườn là sân khấu chính; mọi panel còn lại là ghi chú của người làm vườn.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AudioLines,
  BookOpen,
  Bug,
  ChevronRight,
  CloudRain,
  Droplets,
  Flower2,
  KeyRound,
  Leaf,
  LockKeyhole,
  Moon,
  Package,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Tab = "garden" | "memory" | "journal";
type TimeOfDay = "day" | "night";
type Weather = "clear" | "rain";
type PlantState = "empty" | "seed" | "thirsty" | "bloom" | "mutated";

type Plot = {
  id: number;
  name: string;
  state: PlantState;
  emoji: string;
  note: string;
};

type AudioNodes = {
  context: AudioContext;
  drone: OscillatorNode;
  pulse: OscillatorNode;
  master: GainNode;
  droneGain: GainNode;
  pulseGain: GainNode;
};

const ASSETS = {
  hero: "/manus-storage/bee-garden-hero_b09f9024.jpg",
  door: "/manus-storage/bee-garden-door_d64609f8.jpg",
  memoryMap: "/manus-storage/bee-garden-memory-map_12eb8907.jpg",
  butterfly: "/manus-storage/bee-garden-butterfly_e49f3bac.jpg",
  logo: "/manus-storage/bee-garden-logo_ac8c5c49.png",
};

const INITIAL_PLOTS: Plot[] = [
  { id: 1, name: "Tulip Kem", state: "bloom", emoji: "✿", note: "Nở đủ nắng." },
  { id: 2, name: "Hướng Dương Sao", state: "mutated", emoji: "✦", note: "Mưa đêm đã chạm vào nó." },
  { id: 3, name: "Ô đất nhỏ", state: "empty", emoji: "·", note: "Chờ một hạt giống." },
  { id: 4, name: "Hoa Mặt Trăng", state: "thirsty", emoji: "◌", note: "Cần một lượt tưới." },
  { id: 5, name: "Mầm non", state: "seed", emoji: "⌁", note: "Đang lớn chậm rãi." },
  { id: 6, name: "Ô đất nhỏ", state: "empty", emoji: "·", note: "Có dấu phấn hoa." },
];

const MEMORY_REGIONS = [
  { id: 1, name: "Hiên Mật Ong", icon: "◒", state: "Đã hiểu", tone: "done" },
  { id: 2, name: "Vườn Hạt Cuối", icon: "✦", state: "Có dấu vết", tone: "trace" },
  { id: 3, name: "Hồ Phản Chiếu", icon: "◌", state: "Chưa nhớ", tone: "locked" },
  { id: 4, name: "Tổ Ong Rỗng", icon: "⌂", state: "Bị nhiễu", tone: "noise" },
  { id: 5, name: "Phòng Không Tường", icon: "◇", state: "Chưa nhớ", tone: "locked" },
];

function environmentLabel(time: TimeOfDay, weather: Weather) {
  if (time === "night" && weather === "rain") return "Mưa đêm · ký ức đang thức";
  if (time === "night") return "Đêm yên · mực đêm lan nhẹ";
  if (weather === "rain") return "Mưa dịu · đất đang nhớ";
  return "Ngày trong · vườn đang thở";
}

function stateLabel(state: PlantState) {
  const labels: Record<PlantState, string> = {
    empty: "Đất trống",
    seed: "Đang nảy",
    thirsty: "Cần tưới",
    bloom: "Đang nở",
    mutated: "Biến thể",
  };
  return labels[state];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("garden");
  const [time, setTime] = useState<TimeOfDay>("day");
  const [weather, setWeather] = useState<Weather>("clear");
  const [plots, setPlots] = useState<Plot[]>(INITIAL_PLOTS);
  const [selectedPlot, setSelectedPlot] = useState(4);
  const [water, setWater] = useState(4);
  const [seeds, setSeeds] = useState(3);
  const [honey, setHoney] = useState(42);
  const [beeBond, setBeeBond] = useState(14);
  const [butterflySeen, setButterflySeen] = useState(false);
  const [memoryCount, setMemoryCount] = useState(1);
  const [doorPanelOpen, setDoorPanelOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<AudioNodes | null>(null);

  const selected = plots.find((plot) => plot.id === selectedPlot) ?? plots[0];
  const environment = environmentLabel(time, weather);
  const filledSlots = useMemo(
    () => [
      { icon: "✦", label: "Hạt Tulip", amount: seeds, tone: "seed" },
      { icon: "◉", label: "Mật Ong", amount: honey, tone: "honey" },
      { icon: "⌁", label: "Phấn hoa", amount: 2, tone: "pollen" },
      { icon: "◇", label: "Mảnh ký ức", amount: memoryCount, tone: "memory" },
    ],
    [honey, memoryCount, seeds],
  );

  function updateAudioScene() {
    const nodes = audioRef.current;
    if (!nodes) return;
    const isNight = time === "night";
    const isRain = weather === "rain";
    nodes.drone.frequency.setTargetAtTime(isNight ? 164.81 : 220, nodes.context.currentTime, 0.2);
    nodes.pulse.frequency.setTargetAtTime(isNight ? 246.94 : 329.63, nodes.context.currentTime, 0.2);
    nodes.droneGain.gain.setTargetAtTime(isRain ? 0.04 : 0.027, nodes.context.currentTime, 0.25);
    nodes.pulseGain.gain.setTargetAtTime(isNight ? 0.018 : 0.011, nodes.context.currentTime, 0.25);
  }

  function startAudio() {
    if (audioRef.current) {
      void audioRef.current.context.resume();
      return;
    }
    const context = new AudioContext();
    const master = context.createGain();
    const droneGain = context.createGain();
    const pulseGain = context.createGain();
    const drone = context.createOscillator();
    const pulse = context.createOscillator();
    drone.type = "sine";
    pulse.type = "triangle";
    master.gain.value = 0.38;
    droneGain.gain.value = 0.03;
    pulseGain.gain.value = 0.012;
    drone.connect(droneGain).connect(master);
    pulse.connect(pulseGain).connect(master);
    master.connect(context.destination);
    drone.start();
    pulse.start();
    audioRef.current = { context, drone, pulse, master, droneGain, pulseGain };
    updateAudioScene();
  }

  function stopAudio() {
    const nodes = audioRef.current;
    if (!nodes) return;
    nodes.master.gain.exponentialRampToValueAtTime(0.0001, nodes.context.currentTime + 0.18);
    window.setTimeout(() => {
      nodes.drone.stop();
      nodes.pulse.stop();
      void nodes.context.close();
      audioRef.current = null;
    }, 220);
  }

  function playChime(kind: "soft" | "magic" | "wrong") {
    const nodes = audioRef.current;
    if (!nodes) return;
    const now = nodes.context.currentTime;
    const oscillator = nodes.context.createOscillator();
    const gain = nodes.context.createGain();
    oscillator.type = kind === "wrong" ? "sawtooth" : "sine";
    oscillator.frequency.setValueAtTime(kind === "magic" ? 740 : kind === "wrong" ? 150 : 520, now);
    oscillator.frequency.exponentialRampToValueAtTime(kind === "magic" ? 1047 : 310, now + 0.18);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    oscillator.connect(gain).connect(nodes.master);
    oscillator.start(now);
    oscillator.stop(now + 0.24);
  }

  useEffect(() => {
    if (soundOn) updateAudioScene();
  }, [soundOn, time, weather]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  function toggleSound() {
    if (soundOn) {
      stopAudio();
      setSoundOn(false);
      toast("Âm thanh đã nghỉ", { description: "Khu vườn vẫn tiếp tục thở thật khẽ." });
      return;
    }
    startAudio();
    setSoundOn(true);
    playChime("soft");
    toast("Âm thanh đã thức", { description: environment });
  }

  function toggleTime() {
    setTime((current) => (current === "day" ? "night" : "day"));
    playChime("soft");
  }

  function toggleWeather() {
    setWeather((current) => (current === "clear" ? "rain" : "clear"));
    playChime("soft");
  }

  function waterPlant() {
    if (water <= 0) {
      playChime("wrong");
      toast("Bình tưới đã cạn", { description: "Hãy tìm thêm nước ở Ao Nước." });
      return;
    }
    if (selected.state === "empty") {
      toast("Ô đất này chưa có cây", { description: "Một hạt giống sẽ thích chiếc ô này." });
      return;
    }
    setWater((current) => current - 1);
    setPlots((current) =>
      current.map((plot) =>
        plot.id === selected.id
          ? {
              ...plot,
              state: plot.state === "thirsty" ? "bloom" : plot.state,
              note: plot.state === "thirsty" ? "Đã uống đủ nước và đang nở." : "Lá đã sáng hơn một chút.",
            }
          : plot,
      ),
    );
    playChime("soft");
    toast("Nước chạm vào đất", { description: selected.state === "thirsty" ? "Một bông hoa vừa mở mắt." : "Cây nghiêng lá cảm ơn bạn." });
  }

  function plantSeed() {
    if (seeds <= 0) {
      toast("Túi hạt đã trống", { description: "Ong có thể tìm thấy một hạt giống khi thân thiết hơn." });
      return;
    }
    if (selected.state !== "empty") {
      toast("Ô đất này đã có cây", { description: "Chọn một ô đất trống có dấu chấm nhỏ." });
      return;
    }
    setSeeds((current) => current - 1);
    setPlots((current) => current.map((plot) => (plot.id === selected.id ? { ...plot, name: "Tulip Kem", state: "seed", emoji: "⌁", note: "Hạt vừa nằm xuống đất." } : plot)));
    playChime("soft");
    toast("Bạn đã gieo một hạt Tulip", { description: "Có thể nó sẽ lớn khác đi nếu gặp mưa đêm." });
  }

  function talkToBee() {
    setBeeBond((current) => current + 1);
    if (beeBond >= 16 && memoryCount < 2) {
      setMemoryCount(2);
      playChime("magic");
      toast("Ong trao một mảnh ký ức", { description: "“Ba tiếng gõ không phải lúc nào cũng là lời mời.”" });
      return;
    }
    playChime("soft");
    toast("Ong bay một vòng quanh sổ", { description: "“Đừng quên nhìn đất sau cơn mưa.”" });
  }

  function followButterfly() {
    if (butterflySeen) {
      toast("Bướm đã bay về phía ao", { description: "Nó chỉ xuất hiện một lần trong mỗi cơn mưa." });
      return;
    }
    setButterflySeen(true);
    setHoney((current) => current + 3);
    playChime("magic");
    toast("Bướm xanh để lại phấn hoa", { description: "Bạn nhận 3 Mật Ong và một đường bay mới trong Sổ tay." });
  }

  function inspectDoor() {
    setDoorPanelOpen(true);
    playChime("magic");
  }

  return (
    <div className={`app-shell ${time === "night" ? "is-night" : ""} ${weather === "rain" ? "is-rain" : ""}`}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" role="img" aria-label="Giọt mật, đường bay của Ong và lá non"><span className="brand-leaf" /><span className="brand-flight" /></div>
          <div>
            <p className="eyebrow">Một khu vườn biết nhớ</p>
            <h1>Vườn Nhỏ Của Ong</h1>
          </div>
        </div>

        <nav className="top-nav" aria-label="Điều hướng chính">
          <button className={activeTab === "garden" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("garden")}>
            <Leaf size={16} /> Vườn
          </button>
          <button className={activeTab === "memory" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("memory")}>
            <Sparkles size={16} /> Ký ức
          </button>
          <button className={activeTab === "journal" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("journal")}>
            <BookOpen size={16} /> Sổ tay
          </button>
        </nav>

        <div className="top-actions">
          <button className="environment-chip" onClick={toggleTime} aria-label="Đổi trạng thái ngày hoặc đêm">
            {time === "day" ? <Sun size={17} /> : <Moon size={17} />} {time === "day" ? "Ngày 12" : "Đêm 12"}
          </button>
          <button className="environment-chip" onClick={toggleWeather} aria-label="Đổi trạng thái trời trong hoặc mưa">
            {weather === "rain" ? <CloudRain size={17} /> : <Sparkles size={17} />} {weather === "rain" ? "Mưa" : "Trong"}
          </button>
          <button className={soundOn ? "sound-button on" : "sound-button"} onClick={toggleSound} aria-label="Bật hoặc tắt âm thanh">
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      <main className="workbench">
        <aside className="garden-notes" aria-label="Ghi chú hôm nay">
          <section className="note-card bee-card">
            <div className="card-kicker"><span className="pollen-dot" /> Ghi chú của Ong</div>
            <div className="bee-portrait"><Bug size={20} /><span>Ong</span><em>thân thiết {beeBond}</em></div>
            <p>“{weather === "rain" ? "Mưa làm đất nhớ nhanh hơn. Hãy thử nhìn kỹ những bông hoa." : "Cánh cửa không hề ngủ. Nó chỉ đang chờ một ký ức đúng."}”</p>
            <Button className="ink-button" onClick={talkToBee}><AudioLines size={16} /> Hỏi Ong</Button>
          </section>

          <section className="note-card mission-card">
            <div className="card-kicker"><span className="pollen-dot moss" /> Việc nhỏ hôm nay</div>
            <ul className="mission-list">
              <li className="done"><span>✓</span> Tưới ít nhất một cây</li>
              <li><span>○</span> Theo dấu Bướm xanh</li>
              <li><span>○</span> Chạm vào cánh cửa</li>
            </ul>
            <div className="progress-line"><span style={{ width: "38%" }} /></div>
            <small>1 / 3 dấu vết đã ghi nhận</small>
          </section>

          <section className="note-card audio-card">
            <div className="audio-head"><div><AudioLines size={17} /> Âm thanh vườn</div><span className={soundOn ? "status-dot live" : "status-dot"}>{soundOn ? "ĐANG PHÁT" : "TẮT"}</span></div>
            <p>{environment}</p>
            <button className="text-action" onClick={toggleSound}>{soundOn ? "Để khu vườn nghỉ" : "Đánh thức giai điệu"}<ChevronRight size={14} /></button>
          </section>
        </aside>

        <section className="main-stage">
          {activeTab === "garden" && (
            <div className="garden-view">
              <div className="stage-heading">
                <div>
                  <p className="eyebrow">Mảnh Vườn Số 01</p>
                  <h2>Buổi {time === "day" ? "sáng" : "đêm"} dịu trong khu vườn</h2>
                </div>
                <div className="honey-counter"><span>◉</span><strong>{honey}</strong><small>Mật Ong</small></div>
              </div>

              <div className="garden-canvas" style={{ backgroundImage: `linear-gradient(90deg, rgba(33, 56, 36, .16), rgba(255,255,255,0) 52%), url(${ASSETS.hero})` }}>
                <div className="garden-stamp">{environment}</div>
                <button className="creature butterfly" onClick={followButterfly} aria-label="Theo Bướm xanh"><span className="butterfly-mark">✧</span><span>Theo Bướm</span></button>
                <button className="creature bee" onClick={talkToBee} aria-label="Nói chuyện với Ong"><Bug size={22} /><span>Hỏi Ong</span></button>
                <button className="door-hotspot" onClick={inspectDoor} aria-label="Kiểm tra cánh cửa bí ẩn"><LockKeyhole size={18} /><span>Cánh cửa</span></button>
                <div className="plot-grid" aria-label="Các ô đất trong khu vườn">
                  {plots.map((plot) => (
                    <button key={plot.id} onClick={() => setSelectedPlot(plot.id)} className={`plot ${plot.state} ${selectedPlot === plot.id ? "selected" : ""}`} aria-label={`${plot.name}: ${stateLabel(plot.state)}`}>
                      <span className="plot-emoji">{plot.emoji}</span>
                      <span className="plot-name">{plot.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="garden-toolbar">
                <div className="selection-note"><span className={`state-mark ${selected.state}`} /> <div><strong>{selected.name}</strong><p>{selected.note}</p></div></div>
                <div className="tool-actions">
                  <Button variant="outline" className="tool-button" onClick={plantSeed}><Flower2 size={17} /> Gieo hạt <b>{seeds}</b></Button>
                  <Button className="honey-button" onClick={waterPlant}><Droplets size={17} /> Tưới cây <b>{water}</b></Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "memory" && (
            <div className="memory-view">
              <div className="stage-heading memory-title">
                <div><p className="eyebrow">Sau cánh cửa</p><h2>Bản đồ của những điều Ong đã quên</h2></div>
                <div className="memory-count"><Sparkles size={16} /> {memoryCount} / 5 mảnh ký ức</div>
              </div>
              <div className="memory-map">
                <span className="map-sun" /><span className="map-pond" /><span className="map-hive" /><span className="map-trail-line" />
                <div className="map-caption"><p>“Ký ức không nằm yên một chỗ.”</p><span>— Ong</span></div>
              </div>
              <div className="memory-trail">
                {MEMORY_REGIONS.map((region, index) => (
                  <button key={region.id} className={`memory-stop ${region.tone}`} onClick={() => { if (index <= memoryCount) { toast(region.name, { description: index === 1 ? "Một hạt giống đang chờ điều kiện mưa đêm." : "Khu vực này cần thêm ký ức để hiện rõ." }); playChime(index === 1 ? "magic" : "soft"); } else { playChime("wrong"); toast("Đường mòn vẫn mờ", { description: "Bạn cần nối thêm ký ức trước khi đi sâu hơn." }); } }}>
                    <span className="stop-icon">{region.icon}</span><div><strong>{region.name}</strong><small>{region.state}</small></div><ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "journal" && (
            <div className="journal-view">
              <div className="stage-heading"><div><p className="eyebrow">Ghi chép thực địa</p><h2>Sổ tay người làm vườn</h2></div><button className="journal-filter">Ngày 12 <ChevronRight size={15} /></button></div>
              <article className="journal-entry"><div className="entry-date">12 / 08 · Sau cơn mưa</div><h3>Hướng Dương Sao không còn giống hôm qua</h3><p>Một vệt sáng nhỏ nằm trong nhị hoa. Ong không chạm vào nó, chỉ bay ba vòng và đậu ở góc trang.</p><div className="entry-tags"><span>Biến thể</span><span>Mưa đêm</span><span>Manh mối</span></div></article>
              <article className="journal-entry faint"><div className="entry-date">Chưa có ngày</div><h3>Một trang dính kín bằng sáp mật ong</h3><p>Bạn chưa thể đọc được dòng này. Có vẻ nó cần năm mảnh ký ức.</p><button onClick={inspectDoor} className="text-action">Xem lại cánh cửa <ChevronRight size={14} /></button></article>
              <div className="inventory-panel"><div className="inventory-heading"><div><Package size={18} /><span>Túi đồ</span></div><small>{filledSlots.length} / 12 ô</small></div><div className="inventory-grid">{Array.from({ length: 12 }).map((_, index) => { const item = filledSlots[index]; return <div className={`inventory-slot ${item ? item.tone : "empty"}`} key={index}>{item ? <><span>{item.icon}</span><small>{item.amount}</small><em>{item.label}</em></> : <span className="slot-empty">·</span>}</div>; })}</div></div>
            </div>
          )}
        </section>

        <aside className="right-rail">
          <section className="door-card">
            <span className="ink-wash wash-one" /><span className="ink-wash wash-two" /><span className="pollen-specks" />
            <div className="ink-door-drawing"><span className="door-arch" /><span className="door-knob" /></div>
            <div className="door-card-top"><span className="wax-seal">05</span><span>Hồ sơ bí mật</span></div>
            <div className="door-card-bottom"><p>Cánh cửa không tên</p><h3>{memoryCount < 5 ? "Nó đang lắng nghe" : "Nó đang chờ bạn"}</h3><button onClick={inspectDoor}>Chạm vào cánh cửa <ChevronRight size={16} /></button></div>
          </section>
          <section className="inventory-mini"><div className="rail-heading"><span><Package size={16} /> Túi đồ</span><small>12 phong bì</small></div><div className="specimen-rack">{filledSlots.map((item) => <div className={`specimen-tag ${item.tone}`} key={item.label}><span>{item.icon}</span><div><small>{item.label}</small><b>× {item.amount}</b></div><i /></div>)}<div className="empty-envelope"><span>8 phong bì</span><small>đang chờ dấu vết</small></div></div><button className="text-action" onClick={() => setActiveTab("journal")}>Mở túi đồ <ChevronRight size={14} /></button></section>
          <section className="garden-weather"><div>{time === "day" ? <Sun size={20} /> : <Moon size={20} />}<span>{time === "day" ? "Ngày 12" : "Đêm 12"}</span></div><p>{weather === "rain" ? "Mưa làm Bướm xanh xuất hiện." : "Trời trong, cây nở chậm rãi."}</p></section>
        </aside>
      </main>

      {doorPanelOpen && (
        <div className="door-overlay" role="dialog" aria-modal="true" aria-labelledby="door-dialog-title">
          <section className="door-dialog">
            <button className="close-dialog" onClick={() => setDoorPanelOpen(false)} aria-label="Đóng"><X size={20} /></button>
            <div className="dialog-image"><span className="dialog-ink" /><div className="dialog-door-line"><span /><i /></div><div className="dialog-pollen">· · ·</div></div>
            <div className="dialog-copy"><p className="eyebrow">Cánh cửa không tên</p><h2 id="door-dialog-title">Nó mở ra khi Ong nhớ được đường về.</h2><p>Trên tay nắm có ba ký hiệu rất nhỏ: Trăng, ba tiếng gõ và một đường bay của Ong. Bạn mới nối được <strong>{memoryCount} / 5</strong> mảnh ký ức.</p><div className="rune-row"><span className="rune">☾</span><span className="rune">III</span><span className="rune">⌁</span></div>{memoryCount >= 5 ? <Button className="honey-button" onClick={() => { playChime("magic"); toast("Cánh cửa hé mở", { description: "Một khu vườn khác đang chờ ở phía sau." }); }}>Bắt đầu giải mã <KeyRound size={16} /></Button> : <Button variant="outline" className="tool-button" onClick={() => { setActiveTab("memory"); setDoorPanelOpen(false); }}>Trở về Bản đồ Ký ức <Sparkles size={16} /></Button>}</div>
          </section>
        </div>
      )}
    </div>
  );
}
