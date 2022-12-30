
import React from "react";
import cover from "./img/pfp.png";
import Player from "./Player";
import ProgressBar from "./ProgressBar";

let songSrc ="https://www.youtube.com/embed/WZx3Jiq8rD4?controls=0";
let songName = "Song";
let artistName = "Artist";
function Screen() {
  return (
    <div>
      <div className="screen-wrapper">
      <div id="screen">
        <div id="song-info">
          <h4> {songName}</h4>
          <h4> {artistName}</h4>
        </div>
        <ProgressBar />
        <iframe
          className="invisble"
          src={songSrc}
          title="YouTube video player"
        ></iframe>
      </div>
      </div>
    </div>
  );
}

let songList = 
[
  {
    name: "asdfghjk",
    link: "https://www.youtube.com/embed/WZx3Jiq8rD4?controls=0",
  },
  {
    name: '1234',
    link: "https://www.youtube.com/embed/WZx3Jiq8rD4?controls=0"
  }
  ];

console.log(songList?.link)

export default Screen;
