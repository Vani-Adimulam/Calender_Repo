import React, { useState, useEffect } from "react";
import '../App.css';

const Clock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  const secondsDegrees = (seconds / 60) * 360;
  const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hoursDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="clock">
      <div className="clock-face">
        <div
          className="hour-hand"
          style={{ transform: `rotate(${hoursDegrees}deg)` }}
        ></div>
        <div
          className="minute-hand"
          style={{ transform: `rotate(${minutesDegrees}deg)` }}
        ></div>
        <div
          className="second-hand"
          style={{ transform: `rotate(${secondsDegrees}deg)` }}
        ></div>
      </div>
    </div>
  );
};

export default Clock;
