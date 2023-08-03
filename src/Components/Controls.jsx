import React from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import Screen from "./Screen";
import { songs } from "../songs";
function Controls() {

  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentURL, setCurrentURL] = useState(songs[currentIdx].url);
  const [isBuffering, setIsBuffering] = useState(false);
  const lastIdx = songs.length - 1;

  const handleNext = () => {
    if (currentIdx === lastIdx) setCurrentIdx(0);
    else setCurrentIdx(currentIdx + 1);
    setCurrentURL(songs[currentIdx].url);
  };
  const bufferHandler = () => {
    setIsBuffering(true);
  };

  const handleMenu = () => {
    console.log("menu");
  };
  const handleBack = () => {
    if (currentIdx === 0) setCurrentIdx(lastIdx);
    else setCurrentIdx(currentIdx - 1);
    setCurrentURL(songs[currentIdx].url);
  };

  return (
    <div className="main-wrapper">
      <Screen playing={playing} />
      {console.log(playing)}
      <div>
        <ReactPlayer
          url={currentURL}
          playing={playing}
          width={0}
          height={0}
          onEnded={handleNext}
          onBuffer={bufferHandler}
        />
      </div>
      <div className="button-wrapper">
        <div id="button-container">
          <div className="row1">
            <button id="menu" onClick={handleMenu}>
              MENU
            </button>
          </div>
          <div className="row2">
            <button id="backward" onClick={handleBack}>
              ⏮
            </button>
            <div className="dot-wrapper">
              <div className="dot"></div>
            </div>
            <button id="forward" onClick={handleNext}>
              ⏭
            </button>
          </div>
          <div className="row3">
            <button id="play" onClick={(e) => setPlaying(!playing)}>
              ⏯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controls;
