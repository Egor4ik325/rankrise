import { useEffect, useRef } from "react";

const CircularProgress = ({ percent }) => {
  // const leftProgress = useRef();
  // useEffect(() => {
  // Change circular progress
  // leftProgress.current.style.transform = "rotate(180deg);";
  // }, [percent]);
  let rightDegrees, leftDegrees;
  if (percent > 50) {
    rightDegrees = 180;
    leftDegrees = ((percent - 50) / 50) * 180;
  } else {
    rightDegrees = (percent / 50) * 180;
    leftDegrees = 0;
  }

  return (
    <div className="circular-progress">
      <span className="circular-progress-left">
        <span
          className="circular-progress-bar circular-progress-bar-bg"
          style={{ transform: `rotate(180deg)` }}
        />
        <span
          className="circular-progress-bar"
          style={{ transform: `rotate(${leftDegrees}deg)` }}
        />
      </span>
      <span className="circular-progress-right">
        <span
          className="circular-progress-bar circular-progress-bar-bg"
          style={{ transform: `rotate(180deg)` }}
        />
        <span
          className="circular-progress-bar"
          style={{ transform: `rotate(${rightDegrees}deg)` }}
        />
      </span>
      <div className="circular-progress-value">{percent}</div>
    </div>
  );
};

export default CircularProgress;
