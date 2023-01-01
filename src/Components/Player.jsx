import React from 'react'

function Player() {

  var songSrc =
    "https://firebasestorage.googleapis.com/v0/b/monke-pod-song-list.appspot.com/o/Ram%20Siya%20Ram.mp3?alt=media&token=cf9154b8-39d6-45a8-86cf-34d7f20d8109";

  return (
    <div >
      <div className="player"><audio src={songSrc} controls></audio></div>
      
    </div>
  );
}

export default Player