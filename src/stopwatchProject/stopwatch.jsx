import { useEffect, useState } from "react";

let file = null;
export const StopWatch = () => {
  
  const [hrTime, setHourTime] = useState(0);
  const [minTime, setMinTime] = useState(0);
  const [secTime, setSecTime] = useState(0);
  const [milliSecTime, setMilliSecTime] = useState(0);

  const startStopwatch = () => {
    if (file == null) {
      file = setInterval(() => {
        setMilliSecTime((data) => data + 1);
      }, 10);
    }
  };

  const stopStopwatch = () => {
    clearInterval(file);
    file = null;
  };
  const resetStopwatch = () => {
    clearInterval(file);
    setMilliSecTime(0);
    setSecTime(0);
    setMinTime(0);
    setHourTime(0);
    
    file = null;
  };

  //Call back logic
  // function handleLogic(number) {
  //   if (sec > 59) {
  //     setMinTime(minTime + 1);
  //     setSec(0);
  //   }
  // }
  // useEffect(handleLogic, [sec]);

   useEffect(() => {
    if (milliSecTime >= 100) {
      setSecTime(secTime + 1);
      setMilliSecTime(0);
    }
  }, [milliSecTime]);


  useEffect(() => {
    if (secTime > 59) {
      setMinTime(minTime + 1);
      setSec(0);
    }
  }, [secTime]);

  useEffect(() => {
    if (minTime > 59) {
      setHourTime(hrTime + 1);
      setMinTime(0);
    }
  }, [minTime]);

  return (
    <div>
      <h1>Stopwatch</h1>
      <p>
        {hrTime} hr : {minTime} min : {secTime} seconds : {milliSecTime} milliSec
      </p>
      <button onClick={startStopwatch}>Start</button>
      <button onClick={stopStopwatch}>Stop</button>
      <button onClick={resetStopwatch}>Reset</button>
    </div>
  );
};
