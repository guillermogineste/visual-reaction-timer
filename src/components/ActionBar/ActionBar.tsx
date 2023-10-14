import React, { useEffect, useState, useRef } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";

interface ActionBarProps {
  isTimerRunning: boolean;
  replayRound: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  formattedTime: string;
  countdownType: "round" | "rest";
  currentRound: number;
  totalRounds: number;
  countdown: number;
  roundTime: number;
  restTime: number;
  isPreRound: boolean;
  isActionBarVisible: boolean;
  setIsActionBarVisible: (isVisible: boolean) => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  isTimerRunning,
  replayRound,
  toggleTimer,
  resetTimer,
  formattedTime,
  countdownType,
  currentRound,
  totalRounds,
  countdown,
  roundTime,
  restTime,
  isPreRound,
  isActionBarVisible,
  setIsActionBarVisible
}) => {
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutDuration = isPreRound ? 7000 : 3000;

  useEffect(() => {
    console.log(timeoutDuration);
    const handleMouseMove = () => {
      setIsActionBarVisible(true);

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }

      hideTimer.current = setTimeout(() => {
        if (isTimerRunning) {
          setIsActionBarVisible(false);
        }
      }, timeoutDuration);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
    handleMouseMove();
  }, [isTimerRunning]);

  console.log("isTimerRunning:", isTimerRunning, "isPreRound:", isPreRound);
  console.log(isActionBarVisible);
  return (
    <div
      className={`action-bar ${isActionBarVisible ? "" : "action-bar--hidden"}`}
      onMouseEnter={() => setIsActionBarVisible(true)}
    >
      <div className="buttons">
        <button className="button button--replay" onClick={replayRound}>
          <span className="material-symbols-rounded">skip_previous</span>
        </button>
        <button className="button button--toggle" onClick={toggleTimer}>
          {isTimerRunning ? (
            <span className="material-symbols-rounded">pause</span>
          ) : (
            <span className="material-symbols-rounded">play_arrow</span>
          )}
        </button>
        <button className="button button--reset" onClick={resetTimer}>
          <span className="material-symbols-rounded">stop</span>
        </button>
      </div>
      <div className="player-timeline">
        {isPreRound ? (
          <span className="message-text heading heading--2">
            {countdown} | Focus on the dot
          </span>
        ) : (
          <span className="timer-text heading heading--2">
            {`${formattedTime} | `}
            {countdownType === "round"
              ? `Round ${currentRound}/${totalRounds}`
              : "Rest"}
          </span>
        )}
        <ProgressBar
          currentRound={currentRound}
          totalRounds={totalRounds}
          countdown={countdown}
          roundTime={roundTime}
          countdownType={countdownType}
          restTime={restTime}
          isPreRound={isPreRound}
        />
      </div>
    </div>
  );
};

export default ActionBar;
