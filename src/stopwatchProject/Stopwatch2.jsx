import React, { useState, useEffect, useRef } from "react";

const StopWatch2 = () => {
  const [time, setTime] = useState({ hr: 0, min: 0, sec: 0, ms: 0 });
  const [status, setStatus] = useState();
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (time) => time.toString().padStart(2, '0');
  const formatMilliSecTime = (time) => time.toString().padStart(3, '0');

  let updateHr = time.hr;
  let updateMin = time.min;
  let updateSec = time.sec;
  let updateMs = time.ms;


  const func = () => {
    if (updateMs === 100) {
      updateMs = 0;
      updateSec++;
    }
    if (updateSec === 60) {
      updateSec = 0;
      updateMin++;
    }
    if (updateMin === 60) {
      updateMin = 0;
      updateHr++;
    }
    if (updateHr === 24) {
      updateHr = 0;
    }
    updateMs++;
    return setTime({
      hr: updateHr,
      min: updateMin,
      sec: updateSec,
      ms: updateMs,
    });
  };

  const start = () => {
    if(!isRunning){
    setIsRunning(true);
    func();
    setStatus(setInterval(func, 10));
    }
  };

  const pause = () => {
    clearInterval(status);
    setIsRunning(false);
  };

  const reset = () => {
    clearInterval(status);
    setTime({ hr: 0, min: 0, sec: 0, ms: 0 });
  };

  return (
    <>
      <div className="stopwatch-container">
        <h1>StopWatch2</h1>
        <p className="time-display">
          {formatTime(time.hr) + ":" + formatTime(time.min) + ":" + formatTime(time.sec) + ":" + formatMilliSecTime(time.ms)}
        </p>
        <div className="controls">
          <button className="start" onClick={start}>
            Start
          </button>
          <button className="pause" onClick={pause}>
            Pause
          </button>
          <button className="reset" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
};
export default StopWatch2;
