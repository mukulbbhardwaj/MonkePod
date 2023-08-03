import React from "react";

function Screen({ playing }) {
  return (
    <div>
      <div className="screen-wrapper">
        <div id="screen">
          {/* {console.log(playing)} */}
          {playing?"playing...":"loading..."}
        </div>
      </div>
    </div>
  );
}

export default Screen;
