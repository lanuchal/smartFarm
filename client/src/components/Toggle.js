import React from "react";
import "./toggle.css";
function Toggle({ sw }) {
  console.log(sw);
  return (
    <div>
      <div>
        <label className="switch">
          {sw === true ? (
            <input
              type="checkbox"
              onClick={() => {
                console.log("asdasd");
              }}
              checked
            />
          ) : (
            <input
              type="checkbox"
              onClick={() => {
                console.log("asdasd");
              }}
            />
          )}

          <span className="slider" />
        </label>
        <label className="switch">
          <input type="checkbox"/>
          <span className="slider round" />
        </label>
      </div>
    </div>
  );
}

export default Toggle;
