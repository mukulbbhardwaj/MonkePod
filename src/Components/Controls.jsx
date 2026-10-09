import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Backdrop from "./Backdrop";
import Screen from "./Screen";
import { songs } from "../songs";

const catalog = songs.map((song, index) => ({
  url: song.url,
  title: song.title || `Track ${String(index + 1).padStart(2, "0")}`,
}));

function shuffle(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const ACCENTS = ["#6ea8ff", "#f0a36b", "#e489a8", "#7dcaa8", "#c9a0f2", "#e8c15a", "#6ec4d8"];

function Controls() {
  const deviceWrap = useRef(null);
  const playerA = useRef(null);
  const playerB = useRef(null);
  const slotRefs = useRef([playerA, playerB]);
  const activeRef = useRef(0);
  const indexRef = useRef(0);
  const primedRef = useRef([false, false]);
  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [active, setActive] = useState(0);
  const [primed, setPrimed] = useState([false, false]);
  const [view, setView] = useState("now");
  const [menuIdx, setMenuIdx] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [durations, setDurations] = useState([0, 0]);
  const [tracks] = useState(() => shuffle(catalog));
  const [volume, setVolume] = useState(0.8);
  const [phone, setPhone] = useState(() => window.matchMedia("(max-width: 700px)").matches);
  const [dark, setDark] = useState(() => {
    const saved = window.localStorage.getItem("monkepod-theme");
    if (saved === "dark" || saved === "light") return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  activeRef.current = active;
  indexRef.current = currentIdx;
  primedRef.current = primed;

  const adjustVolume = useCallback((delta) => {
    setVolume((current) => {
      const next = Math.round((current + delta) * 10) / 10;
      return Math.min(1, Math.max(0, next));
    });
  }, []);

  const goTo = useCallback((index) => {
    const next = ((index % tracks.length) + tracks.length) % tracks.length;
    if (next === indexRef.current) return;
    const standby = 1 - activeRef.current;
    const warm = tracks.length > 1 && next === (indexRef.current + 1) % tracks.length && primedRef.current[standby];

    setProgress(0);
    setPlayedSeconds(0);

    if (warm) {
      slotRefs.current[standby].current?.seekTo(0, "seconds");
      activeRef.current = standby;
      indexRef.current = next;
      primedRef.current = [false, false];
      setActive(standby);
      setCurrentIdx(next);
      setBuffering(false);
      setPrimed([false, false]);
      return;
    }

    setCurrentIdx(next);
    setBuffering(true);
    setDurations([0, 0]);
    setPrimed([false, false]);
  }, [tracks]);

  const handleNext = useCallback(() => {
    if (view === "menu") {
      setMenuIdx((index) => (index + 1) % tracks.length);
      return;
    }
    goTo(currentIdx + 1);
  }, [view, currentIdx, goTo, tracks]);

  const handlePrev = useCallback(() => {
    if (view === "menu") {
      setMenuIdx((index) => (index - 1 + tracks.length) % tracks.length);
      return;
    }
    goTo(currentIdx - 1);
  }, [view, currentIdx, goTo, tracks]);

  const openMenu = useCallback(() => {
    setMenuIdx(currentIdx);
    setView((current) => (current === "menu" ? "now" : "menu"));
  }, [currentIdx]);

  const togglePlay = useCallback(() => {
    setPlaying((current) => !current);
  }, []);

  const select = useCallback(() => {
    if (view !== "menu") return;
    goTo(menuIdx);
    setView("now");
    setPlaying(true);
  }, [view, menuIdx, goTo]);

  const chooseFromMenu = useCallback(
    (index) => {
      setMenuIdx(index);
      goTo(index);
      setView("now");
      setPlaying(true);
    },
    [goTo]
  );

  const seek = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    slotRefs.current[activeRef.current].current?.seekTo(ratio, "fraction");
    setProgress(ratio);
    const length = durations[activeRef.current];
    if (length) setPlayedSeconds(ratio * length);
  };

  useEffect(() => {
    const onKey = (event) => {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((event.key === " " || event.key === "Enter") && event.target?.closest?.("button")) {
        return;
      }
      if (event.key === " ") {
        event.preventDefault();
        togglePlay();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        adjustVolume(0.1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        adjustVolume(-0.1);
      } else if (event.key === "Escape" || event.key === "m" || event.key === "M") {
        openMenu();
      } else if (event.key === "Enter") {
        select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev, openMenu, select, adjustVolume, togglePlay]);

  useEffect(() => {
    window.localStorage.setItem("monkepod-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const onChange = () => setPhone(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const wrap = deviceWrap.current;
    if (!wrap) return undefined;
    const fit = () => {
      wrap.style.setProperty("--s", String(wrap.getBoundingClientRect().width / 340));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const accent = ACCENTS[currentIdx % ACCENTS.length];
  const live = playing && !buffering;

  return (
    <>
    <Backdrop scene={currentIdx} />
    <button
      type="button"
      className={`theme-toggle${dark ? " dark" : ""}`}
      onClick={() => setDark((current) => !current)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <IconTheme dark={dark} />
    </button>
    <div className={`pod${live ? " live" : ""}${dark ? " dark" : ""}`} style={{ "--accent": accent }}>
      <div className="glow" aria-hidden="true" />
      <div className="device-wrap" ref={deviceWrap}>
      <div className="device">
        <Screen
          view={view}
          tracks={tracks}
          currentIdx={currentIdx}
          menuIdx={menuIdx}
          playing={playing}
          buffering={buffering}
          progress={progress}
          playedSeconds={playedSeconds}
          duration={durations[active]}
          volume={volume}
          showVolume={!phone}
          onOpenMenu={openMenu}
          onSeek={seek}
          onChoose={chooseFromMenu}
        />
        <div className="volume-rocker">
          <button type="button" onClick={() => adjustVolume(0.1)} aria-label="Volume up">
            +
          </button>
          <button type="button" onClick={() => adjustVolume(-0.1)} aria-label="Volume down">
            −
          </button>
        </div>
        <div className="wheel">
          <button type="button" className="pad menu" onClick={openMenu} aria-label="Menu">
            Menu
          </button>
          <button type="button" className="pad prev" onClick={handlePrev} aria-label="Previous">
            <IconPrev />
          </button>
          <button type="button" className="pad next" onClick={handleNext} aria-label="Next">
            <IconNext />
          </button>
          <button type="button" className="pad play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            <IconPlayPause />
          </button>
          <button type="button" className="center" onClick={select} aria-label="Select" />
        </div>
      </div>
      <div className="sr-player">
        {[0, 1].map((slot) => {
          const isActive = slot === active;
          const nextIdx = (currentIdx + 1) % tracks.length;
          return (
            <ReactPlayer
              key={slot}
              ref={slotRefs.current[slot]}
              url={isActive ? tracks[currentIdx].url : tracks[nextIdx].url}
              playing={isActive ? playing : playing && !primed[slot]}
              muted={!isActive}
              volume={isActive ? (phone ? 1 : volume) : 0}
              width={360}
              height={202}
              progressInterval={250}
              onEnded={() => {
                if (slot === activeRef.current) goTo(indexRef.current + 1);
              }}
              onBuffer={() => {
                if (slot === activeRef.current) setBuffering(true);
              }}
              onBufferEnd={() => {
                if (slot === activeRef.current) {
                  setBuffering(false);
                  return;
                }
                if (primedRef.current[slot]) return;
                const copy = [...primedRef.current];
                copy[slot] = true;
                primedRef.current = copy;
                slotRefs.current[slot].current?.seekTo(0, "seconds");
                setPrimed(copy);
              }}
              onPlay={() => {
                if (slot === activeRef.current) setBuffering(false);
              }}
              onDuration={(value) => {
                setDurations((list) => {
                  if (list[slot] === value) return list;
                  const copy = [...list];
                  copy[slot] = value;
                  return copy;
                });
              }}
              onProgress={({ played, playedSeconds: seconds }) => {
                if (slot !== activeRef.current) return;
                setProgress(played);
                setPlayedSeconds(seconds);
              }}
              config={{
                youtube: {
                  playerVars: { modestbranding: 1, rel: 0, playsinline: 1 },
                },
              }}
            />
          );
        })}
      </div>
      </div>
    </div>
    </>
  );
}

function IconTheme({ dark }) {
  return dark ? (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      <path
        fill="currentColor"
        d="M8 1.2h1v2H8v-2zm0 11.6h1v2H8v-2zM1.2 7h2v1h-2V7zm11.6 0h2v1h-2V7zM3.1 3.8l.7-.7 1.4 1.4-.7.7-1.4-1.4zm7.7 7.7.7-.7 1.4 1.4-.7.7-1.4-1.4zM3.8 12.2l1.4-1.4.7.7-1.4 1.4-.7-.7zm7.7-7.7 1.4-1.4.7.7-1.4 1.4-.7-.7z"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.2 1.6a6.2 6.2 0 1 0 5.2 8.6 5 5 0 0 1-5.2-8.6z"
      />
    </svg>
  );
}

function IconPlayPause() {
  return (
    <svg viewBox="0 0 36 18" width="36" height="18" aria-hidden="true">
      <path fill="currentColor" d="M0.5 1.4 12.5 9 0.5 16.6V1.4z" />
      <path fill="currentColor" d="M18 1.4h4.4v15.2H18V1.4zm8 0h4.4v15.2H26V1.4z" />
    </svg>
  );
}

function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M4 6h2v12H4V6zm9.4.4L8 12l5.4 5.6V6.4zm6.2 0L14.2 12l5.4 5.6V6.4z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M18 6h2v12h-2V6zM4.4 6.4 9.8 12 4.4 17.6V6.4zm6.2 0L16 12l-5.4 5.6V6.4z" />
    </svg>
  );
}

export default Controls;
