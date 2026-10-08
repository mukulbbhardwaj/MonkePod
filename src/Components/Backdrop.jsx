import React from "react";

const SCENES = ["rain", "dusk", "city", "room", "sea"];

function Backdrop({ scene }) {
  const name = SCENES[scene % SCENES.length];

  return (
    <div key={name} className="backdrop" aria-hidden="true">
      <img
        className="backdrop-gif"
        src={`${process.env.PUBLIC_URL}/gifs/${name}.gif`}
        alt=""
      />
      <div className="backdrop-vignette" />
    </div>
  );
}

export default Backdrop;
