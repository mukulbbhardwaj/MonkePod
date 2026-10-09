import React from "react";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${String(remain).padStart(2, "0")}`;
}

function Screen({
  view,
  tracks,
  currentIdx,
  menuIdx,
  playing,
  buffering,
  progress,
  playedSeconds,
  duration,
  volume,
  showVolume,
  onOpenMenu,
  onSeek,
  onChoose,
}) {
  const current = tracks[currentIdx];
  const stateLabel = playing ? (buffering ? "Buffering" : "Playing") : "Paused";
  const visibleRows = 5;
  const menuOffset = Math.min(
    Math.max(0, tracks.length - visibleRows),
    Math.max(0, menuIdx - 2)
  );

  return (
    <div className="bezel">
      <div className="lcd">
        {view === "menu" ? (
          <div className="lcd-view" key="menu">
            <div className="status">
              <button type="button" className="status-link" onClick={onOpenMenu}>
                Songs
              </button>
              <span>
                {menuIdx + 1} / {tracks.length}
              </span>
            </div>
            <div className="menu">
              <div className="menu-track" style={{ "--offset": menuOffset }}>
                <div
                  className="menu-highlight"
                  style={{ "--i": menuIdx - menuOffset }}
                />
                {tracks.map((track, index) => (
                  <button
                    key={track.url}
                    type="button"
                    className={`menu-item${index === menuIdx ? " selected" : ""}`}
                    onClick={() => onChoose(index)}
                  >
                    <span className="menu-title">{track.title}</span>
                    <span className="index">{String(index + 1).padStart(2, "0")}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lcd-view" key={`now-${currentIdx}`}>
            <div className="status">
              <button type="button" className="status-link" onClick={onOpenMenu}>
                Now Playing
              </button>
              <span>
                {currentIdx + 1} / {tracks.length}
              </span>
            </div>
            <div className="now">
              <div className={`deck${playing && !buffering ? " on" : ""}`}>
                <Meter />
                <div className={`disc${playing && !buffering ? " on" : ""}`} />
                <Meter mirror />
              </div>
              <h2 className="track-title">{current.title}</h2>
              <p className="track-state">
                <span className={`eq${playing && !buffering ? " on" : ""}`} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                {stateLabel}
                {showVolume && (
                  <>
                    <span className="dot-sep">·</span>
                    {Math.round(volume * 100)}%
                  </>
                )}
              </p>
            </div>
            <div className="transport">
              <div className="times">
                <span>{formatTime(playedSeconds)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <button type="button" className="seek" onClick={onSeek} aria-label="Seek">
                <span className="seek-track">
                  <span
                    className="seek-fill"
                    style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                  >
                    <span className="seek-knob" />
                  </span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Meter({ mirror = false }) {
  return (
    <div className={`vu${mirror ? " mirror" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export default Screen;
