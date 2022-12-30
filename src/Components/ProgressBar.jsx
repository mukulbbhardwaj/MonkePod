import React from 'react'
import audio from '../assets/music.mp3'
// var elapsedtime = '0:10';
// let remainingtime = '2:30';
// const audioSrc = "https://www.youtube.com/embed/WZx3Jiq8rD4";
  // "https://firebasestorage.googleapis.com/v0/b/monke-pod-song-list.appspot.com/o/music.mp3?alt=media&token=8d718023-4862-43cb-8763-6a57bc720835";
function ProgressBar() {
  return (
    <div>
      <div className='progress-wrapper'>
          <div className="progress-container">
        {/* <div className="elapsedtime">{elapsedtime}</div>
        <div className="progress">
          <input type="range" />
              </div>
        <div className="remainingtime">{remainingtime}</div> */}
          {/* <audio src={audioSrc} controls></audio> */}
          </div></div>
    </div>
  )
}

export default ProgressBar