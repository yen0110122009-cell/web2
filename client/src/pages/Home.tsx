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
import MemoryAtlas from "@/components/MemoryAtlas";
import MutationGallery from "@/components/MutationGallery";
import ProgressArchive from "@/components/ProgressArchive";
import { GardenDecorations, MemoryRewards } from "@/components/MemoryRewards";
import { NarrationCaption, type ActiveCaption } from "@/components/NarrationCaption";
import {
  createMemoryProgress,
  loadGardenProgress,
  mergeMemoryProgress,
  saveGardenProgress,
  type DecorationPlacement,
  type GardenPlot,
  type GardenProgressSnapshot,
  type MemoryProgress,
  type RegionKey,
  type TimeOfDay,
  type Weather,
} from "@/lib/garden-progress";

type Tab = "garden" | "memory" | "journal";
type NarrationCue = "intro" | RegionKey;
type CaptionLine = { start: number; end: number; text: string };

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

const NARRATIONS: Record<NarrationCue, string> = {
  intro: "/manus-storage/ong-garden-intro_816a1f21.wav",
  porch: "/manus-storage/ong-memory-porch_79a6b8d9.wav",
  seed: "/manus-storage/ong-memory-seed_c97014c1.wav",
  lake: "/manus-storage/ong-memory-pond_5685f11b.wav",
  hive: "/manus-storage/ong-memory-hive_7fcb5af4.wav",
  room: "/manus-storage/ong-memory-room_d65dfa19.wav",
};

const CAPTION_LABELS: Record<NarrationCue, string> = { intro: "Lời mở đầu", porch: "Hiên Mật Ong", seed: "Vườn Hạt Cuối", lake: "Hồ Phản Chiếu", hive: "Tổ Ong Rỗng", room: "Phòng Không Tường" };
const CAPTIONS: Record<NarrationCue, CaptionLine[]> = {
  intro: [{ start: 0.3, end: 1.3, text: "Tớ là Ong." }, { start: 1.3, end: 7.7, text: "Mỗi dấu ấn cậu khôi phục, khu vườn sẽ nhớ thêm một điều dịu dàng." }],
  porch: [{ start: 0.8, end: 4.6, text: "Dưới hiên, lá khô còn biết giữ bước chân." }, { start: 4.6, end: 8.1, text: "Hãy ghép chúng về đúng chỗ nhé." }],
  seed: [{ start: 0.5, end: 2.7, text: "Hạt cuối không cần vội." }, { start: 2.7, end: 10.2, text: "Đợi mưa đêm rồi đặt nó xuống nơi đất còn ấm." }],
  lake: [{ start: 0.4, end: 8.2, text: "Hồ chỉ nói thật khi mặt nước cùng lúc giữ được sáng, yên và tối." }],
  hive: [{ start: 0.4, end: 4.1, text: "Lắng nghe khoảng trống giữa những tiếng vo ve." }, { start: 4.1, end: 7.7, text: "Đó là đường về của tớ." }],
  room: [{ start: 0.4, end: 3.2, text: "Một ngày đã mất không ở ngoài kia." }, { start: 3.2, end: 7.6, text: "Nó đang nằm rải rác trong những thứ cậu đã nhặt." }],
};

const INITIAL_PLOTS: GardenPlot[] = [
  { id: 1, name: "Tulip Kem", state: "bloom", emoji: "✿", note: "Nở đủ nắng." },
  { id: 2, name: "Hướng Dương Sao", state: "mutated", emoji: "✦", note: "Mưa đêm đã chạm vào nó." },
  { id: 3, name: "Ô đất nhỏ", state: "empty", emoji: "·", note: "Chờ một hạt giống." },
  { id: 4, name: "Hoa Mặt Trăng", state: "thirsty", emoji: "◌", note: "Cần một lượt tưới." },
  { id: 5, name: "Mầm non", state: "seed", emoji: "⌁", note: "Đang lớn chậm rãi." },
  { id: 6, name: "Ô đất nhỏ", state: "empty", emoji: "·", note: "Có dấu phấn hoa." },
];

function environmentLabel(time: TimeOfDay, weather: Weather) {
  if (time === "night" && weather === "rain") return "Mưa đêm · ký ức đang thức";
  if (time === "night") return "Đêm yên · mực đêm lan nhẹ";
  if (weather === "rain") return "Mưa dịu · đất đang nhớ";
  return "Ngày trong · vườn đang thở";
}

function stateLabel(state: GardenPlot["state"]) {
  const labels: Record<GardenPlot["state"], string> = {
    empty: "Đất trống",
    seed: "Đang nảy",
    thirsty: "Cần tưới",
    bloom: "Đang nở",
    mutated: "Biến thể",
  };
  return labels[state];
}

export default function Home() {
  const [initialProgress] = useState(loadGardenProgress);
  const [activeTab, setActiveTab] = useState<Tab>("garden");
  const [time, setTime] = useState<TimeOfDay>(() => initialProgress.time ?? "day");
  const [weather, setWeather] = useState<Weather>(() => initialProgress.weather ?? "clear");
  const [plots, setPlots] = useState<GardenPlot[]>(() => initialProgress.plots?.length ? initialProgress.plots : INITIAL_PLOTS);
  const [selectedPlot, setSelectedPlot] = useState(() => initialProgress.selectedPlot ?? 4);
  const [water, setWater] = useState(() => initialProgress.water ?? 4);
  const [seeds, setSeeds] = useState(() => initialProgress.seeds ?? 3);
  const [honey, setHoney] = useState(() => initialProgress.honey ?? 42);
  const [beeBond, setBeeBond] = useState(() => initialProgress.beeBond ?? 14);
  const [butterflySeen, setButterflySeen] = useState(() => initialProgress.butterflySeen ?? false);
  const [memoryProgress, setMemoryProgress] = useState<MemoryProgress>(() => initialProgress.memory ? mergeMemoryProgress(initialProgress.memory) : createMemoryProgress());
  const [decorations, setDecorations] = useState<DecorationPlacement[]>(() => initialProgress.decorations ?? []);
  const [doorPanelOpen, setDoorPanelOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [caption, setCaption] = useState<ActiveCaption | null>(null);
  const audioRef = useRef<AudioNodes | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);

  const selected = plots.find((plot) => plot.id === selectedPlot) ?? plots[0];
  const environment = environmentLabel(time, weather);
  const memoryCount = useMemo(() => Object.values(memoryProgress).filter((region) => region.status === 3).length, [memoryProgress]);
  const fragmentCount = useMemo(() => Object.values(memoryProgress).reduce((total, region) => total + region.fragments.length, 0), [memoryProgress]);
  const filledSlots = useMemo(
    () => [
      { icon: "✦", label: "Phong bì Tulip", amount: seeds, tone: "seed" },
      { icon: "◉", label: "Giọt mật", amount: honey, tone: "honey" },
      { icon: "⌁", label: "Phấn hoa", amount: 2, tone: "pollen" },
      { icon: "◇", label: "Mảnh đã ghi", amount: fragmentCount, tone: "memory" },
    ],
    [fragmentCount, honey, seeds],
  );
  const gardenProgress = useMemo<GardenProgressSnapshot>(() => ({
    version: 4,
    updatedAt: new Date().toISOString(),
    time,
    weather,
    plots,
    selectedPlot,
    water,
    seeds,
    honey,
    beeBond,
    butterflySeen,
    memory: memoryProgress,
    decorations,
  }), [beeBond, butterflySeen, decorations, honey, memoryProgress, plots, seeds, selectedPlot, time, water, weather]);

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
    if (narrationRef.current) {
      narrationRef.current.pause();
      narrationRef.current.currentTime = 0;
      narrationRef.current = null;
    }
    setCaption(null);
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

  function playRoomEffect(region: RegionKey) {
    const nodes = audioRef.current;
    if (!nodes) return;
    const tones: Record<RegionKey, [number, number]> = { porch: [620, 760], seed: [410, 560], lake: [290, 430], hive: [120, 160], room: [740, 980] };
    const [from, to] = tones[region];
    const oscillator = nodes.context.createOscillator();
    const gain = nodes.context.createGain();
    const now = nodes.context.currentTime;
    oscillator.type = region === "hive" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(from, now);
    oscillator.frequency.exponentialRampToValueAtTime(to, now + .34);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(region === "hive" ? .035 : .06, now + .04);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .48);
    oscillator.connect(gain).connect(nodes.master);
    oscillator.start(now);
    oscillator.stop(now + .5);
  }

  function playNarration(cue: NarrationCue) {
    if (!audioRef.current) {
      startAudio();
      setSoundOn(true);
    }
    if (cue !== "intro") playRoomEffect(cue);
    if (narrationRef.current) {
      narrationRef.current.pause();
      narrationRef.current.currentTime = 0;
    }
    setCaption(null);
    const narration = new Audio(NARRATIONS[cue]);
    const lines = CAPTIONS[cue];
    const updateCaption = () => {
      const index = lines.findIndex((line) => narration.currentTime >= line.start && narration.currentTime < line.end);
      const resolvedIndex = index === -1 && narration.currentTime >= lines[lines.length - 1].end ? lines.length - 1 : index;
      setCaption(resolvedIndex === -1 ? null : { cueLabel: CAPTION_LABELS[cue], text: lines[resolvedIndex].text, index: resolvedIndex + 1, total: lines.length });
    };
    narration.preload = "auto";
    narration.volume = .76;
    narration.onplay = updateCaption;
    narration.ontimeupdate = updateCaption;
    narration.onended = () => {
      if (narrationRef.current === narration) narrationRef.current = null;
      setCaption(null);
    };
    narrationRef.current = narration;
    void narration.play().catch(() => {
      setCaption(null);
      toast("Lời dẫn đang chờ một cái chạm", { description: "Hãy chạm lại nút Nghe Ong để bắt đầu âm thanh." });
    });
  }

  useEffect(() => {
    if (soundOn) updateAudioScene();
  }, [soundOn, time, weather]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  useEffect(() => {
    saveGardenProgress(gardenProgress);
  }, [gardenProgress]);

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
    playNarration("intro");
    if (beeBond >= 16 && memoryProgress.porch.status < 2) {
      setMemoryProgress((current) => ({ ...current, porch: { ...current.porch, status: 2, fragments: current.porch.fragments.includes("bee-three-knocks") ? current.porch.fragments : [...current.porch.fragments, "bee-three-knocks"] } }));
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

  function handleRegionUnderstood() {
    setHoney((current) => current + 2);
    setBeeBond((current) => current + 1);
  }

  function importGardenProgress(snapshot: GardenProgressSnapshot) {
    setTime(snapshot.time);
    setWeather(snapshot.weather);
    setPlots(snapshot.plots);
    setSelectedPlot(snapshot.selectedPlot);
    setWater(snapshot.water);
    setSeeds(snapshot.seeds);
    setHoney(snapshot.honey);
    setBeeBond(snapshot.beeBond);
    setButterflySeen(snapshot.butterflySeen);
    setMemoryProgress(mergeMemoryProgress(snapshot.memory));
    setDecorations(snapshot.decorations);
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
            <div className="card-kicker"><span className="pollen-dot moss" /> Điều vườn đang nhờ</div>
            <ul className="mission-list">
              <li className="done"><span>✓</span> Tưới ít nhất một cây</li>
              <li><span>○</span> Theo dấu Bướm xanh</li>
              <li><span>○</span> Chạm vào cánh cửa</li>
            </ul>
            <div className="progress-line"><span style={{ width: "38%" }} /></div>
            <small>1 / 3 dấu vết đã ghi nhận</small>
          </section>

          <section className="note-card audio-card">
            <div className="audio-head"><div><AudioLines size={17} /> Nhịp thở khu vườn</div><span className={soundOn ? "status-dot live" : "status-dot"}>{soundOn ? "ĐANG PHÁT" : "TẮT"}</span></div>
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
                <div className="honey-counter honey-seal"><span>◉</span><strong>{honey}</strong><small>Giọt mật</small></div>
              </div>

              <div className="garden-canvas" style={{ backgroundImage: `linear-gradient(90deg, rgba(33, 56, 36, .16), rgba(255,255,255,0) 52%), url(${ASSETS.hero})` }}>
                <div className="garden-stamp">{environment}</div>
                <div className="garden-marginalia" aria-hidden="true"><span>✦</span><em>Mẫu vật sống · ghi sau cơn mưa</em></div>
                <div className="bee-flight-trace" aria-hidden="true"><i /><i /><i /></div>
                <GardenDecorations progress={memoryProgress} placements={decorations} onPlacementChange={setDecorations} />
                <NarrationCaption caption={caption} onDismiss={() => { narrationRef.current?.pause(); setCaption(null); }} />
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
                  <Button variant="outline" className="tool-button" onClick={plantSeed}><Flower2 size={17} /> Đặt một hạt <b>{seeds}</b></Button>
                  <Button className="honey-button" onClick={waterPlant}><Droplets size={17} /> Tưới cây <b>{water}</b></Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "memory" && <MemoryAtlas progress={memoryProgress} onProgressChange={setMemoryProgress} onRegionUnderstood={handleRegionUnderstood} onNarrate={playNarration} time={time} weather={weather} onTimeChange={setTime} onWeatherChange={setWeather} onChime={playChime} />}

          {activeTab === "journal" && (
            <div className="journal-view">
              <div className="stage-heading"><div><p className="eyebrow">Ghi chép thực địa</p><h2>Sổ tay người làm vườn</h2></div><button className="journal-filter">Ngày 12 <ChevronRight size={15} /></button></div>
              <article className="journal-entry"><div className="entry-date">12 / 08 · Sau cơn mưa</div><h3>Hướng Dương Sao không còn giống hôm qua</h3><p>Một vệt sáng nhỏ nằm trong nhị hoa. Ong không chạm vào nó, chỉ bay ba vòng và đậu ở góc trang.</p><div className="entry-tags"><span>Biến thể</span><span>Mưa đêm</span><span>Manh mối</span></div></article>
              <MutationGallery />
              <MemoryRewards progress={memoryProgress} placements={decorations} onPlacementChange={setDecorations} onVisitGarden={() => setActiveTab("garden")} />
              <article className="journal-entry faint"><div className="entry-date">Chưa có ngày</div><h3>Một trang dính kín bằng sáp mật ong</h3><p>Bạn chưa thể đọc được dòng này. Có vẻ nó cần năm mảnh ký ức.</p><button onClick={inspectDoor} className="text-action">Xem lại cánh cửa <ChevronRight size={14} /></button></article>
              <ProgressArchive snapshot={gardenProgress} onImport={importGardenProgress} />
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
          <section className="inventory-mini"><div className="rail-heading"><span><Package size={16} /> Phong bì dấu vết</span><small>4 / 12 đã ghi</small></div><div className="specimen-rack">{filledSlots.map((item) => <div className={`specimen-tag ${item.tone}`} key={item.label}><span>{item.icon}</span><div><small>{item.label}</small><b>× {item.amount}</b></div><i /></div>)}<div className="empty-envelope"><span>8 phong bì</span><small>đang chờ được ghi nhận</small></div></div><button className="text-action" onClick={() => setActiveTab("journal")}>Mở sổ dấu vết <ChevronRight size={14} /></button></section>
          <section className="garden-weather"><div>{time === "day" ? <Sun size={20} /> : <Moon size={20} />}<span>{time === "day" ? "Ngày 12" : "Đêm 12"}</span></div><p>{weather === "rain" ? "Mưa làm Bướm xanh xuất hiện." : "Trời trong, cây nở chậm rãi."}</p><small className="save-note">● Tự lưu trong trình duyệt</small></section>
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
