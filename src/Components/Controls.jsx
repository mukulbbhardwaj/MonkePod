import React from "react";
import { useState } from "react";

function Controls() {
  const [isPlaying, setPlaying] = useState(false);

  const handlePlay = () => {
    if (isPlaying == true) {
      console.log("pause")

    }
    else {
      console.log("play")
    }
    setPlaying(!isPlaying)
  };

  const handleMenu = () => {
    console.log("menu");
  };
  const handleBack = () => {
    console.log("back");
  };
  const handleForward = () => {
    console.log("forward");
  };

  return (
    <div>
      <div className="button-wrapper">
        <div id="button-container">
          <div className="row1">
            {" "}
            <button id="menu" onClick={handleMenu}>
              MENU
            </button>
          </div>
          <div className="row2">
            {" "}
            <button id="backward" onClick={handleBack}>
              ⏮
            </button>
            <div className="dot-wrapper">
              <div className="dot"></div>
            </div>
            <button id="forward" onClick={handleForward}>
              ⏭
            </button>
          </div>
          <div className="row3">
            <button id="play" onClick={handlePlay}>
              {" "}
              ⏯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controls;
