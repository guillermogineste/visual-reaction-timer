import React, { useState, useEffect } from "react";
import QuadrantGrid from "./components/QuadrantGrid/QuadrantGrid";
import ActionBar from "./components/ActionBar/ActionBar";
import AimDot from "./components/AimDot/AimDot";
import "./styles.css";
import { playBeep } from "./utils/playBeep";

// Constants, time in seconds
const REST_TIME = 10;
const NUMBER_OF_ROUNDS = 5;
const ROUND_TIME = 16;
// Constants for initial state
const INITIAL_ROUND = 1;
const INITIAL_IS_RESTING = false;
const INITIAL_NUMBER_OF_QUADRANTS = 4;
const INITIAL_COUNTDOWN_TYPE = "round";
// Random intervals
const INITIAL_MIN_ACTION_SIGNAL = 1200;
const INITIAL_MAX_ACTION_SIGNAL = 4000;
const SPEED_SETTINGS = {
  fast: { min: 900, max: 1600 },
  medium: { min: 1200, max: 4000 },
  slow: { min: 3000, max: 8000 }
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const App: React.FC = () => {
  const [isPreRound, setIsPreRound] = useState(true);
  const PRE_ROUND_TIME = 5;

  // Countdown type
  const [countdownType, setCountdownType] = useState<"round" | "rest">(
    INITIAL_COUNTDOWN_TYPE
  );

  // Timer feature
  const [currentRound, setCurrentRound] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [countdown, setCountdown] = useState(PRE_ROUND_TIME);

  // Track timer status
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [showActiveClass, setShowActiveClass] = useState(false);

  const [isActionBarVisible, setIsActionBarVisible] = useState(true);

  const getAppClass = (): string => {
    if (isPreRound) {
      return "pre-round";
    } else if (
      !isTimerRunning &&
      countdown === ROUND_TIME &&
      currentRound === INITIAL_ROUND
    ) {
      return "timer-not-started";
    } else if (isTimerRunning) {
      return "timer-started";
    } else if (
      !isTimerRunning &&
      (countdown !== ROUND_TIME || currentRound !== INITIAL_ROUND)
    ) {
      return "timer-paused";
    }
    return "";
  };

  const replayRound = () => {
    setCountdown(ROUND_TIME);
  };
  const toggleTimer = () => {
    if (!isTimerRunning && isPreRound) {
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(!isTimerRunning);
    }
  };
  const resetTimer = () => {
    setIsTimerRunning(false);
    setCurrentRound(INITIAL_ROUND);
    setIsResting(INITIAL_IS_RESTING);
    setCountdown(PRE_ROUND_TIME); // Set the timer to pre-round time
    setCountdownType(INITIAL_COUNTDOWN_TYPE);
    setIsPreRound(true);
  };

  const [activeQuadrant, setActiveQuadrant] = useState<
    "TL" | "TR" | "BL" | "BR" | "CL" | "CR" | "LCL" | "LCR"
  >("TL");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isTimerRunning) {
      timer = setTimeout(() => {
        if (isPreRound) {
          if (countdown > 1) {
            setCountdown(countdown - 1);
          } else {
            setIsPreRound(false);
            setCountdown(ROUND_TIME); // Start the round timer immediately after pre-round ends
            setCountdownType("round");
          }
        } else if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          if (countdownType === "round" && currentRound < NUMBER_OF_ROUNDS) {
            setCountdownType("rest");
            setCountdown(REST_TIME);
          } else if (countdownType === "rest") {
            setCurrentRound(currentRound + 1);
            setCountdownType("round");
            setCountdown(ROUND_TIME);
          } else {
            // End of workout
            setIsTimerRunning(false);
            setCurrentRound(INITIAL_ROUND);
            setCountdownType("round");
            setIsPreRound(true);
            setCountdown(PRE_ROUND_TIME);
            setIsActionBarVisible(true);
          }
        }
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, currentRound, isTimerRunning, countdownType, isPreRound]);

  useEffect(() => {
    setIsResting(countdownType === "rest");
  }, [countdownType]);

  useEffect(() => {
    let actionSignalTimer: NodeJS.Timeout | null = null;

    const quadrantKeys: (
      | "TL"
      | "TR"
      | "BL"
      | "BR"
      | "CL"
      | "CR"
      | "LCL"
      | "LCR"
    )[] = ["TL", "TR", "BL", "BR", "CL", "CR", "LCL", "LCR"];

    const setRandomActionSignal = () => {
      const randomTime =
        Math.random() *
          (INITIAL_MAX_ACTION_SIGNAL - INITIAL_MIN_ACTION_SIGNAL) +
        INITIAL_MIN_ACTION_SIGNAL;

      actionSignalTimer = setTimeout(() => {
        if (isTimerRunning && !isResting) {
          playBeep(100, 500, 1, 1); // Adjust parameters as per your beep function

          // Randomly select a quadrant from the available quadrants based on numberOfQuadrants
          const availableQuadrants = quadrantKeys.slice(
            0,
            Number(INITIAL_NUMBER_OF_QUADRANTS)
          );
          const randomIndex = Math.floor(
            Math.random() * availableQuadrants.length
          );
          const randomQuadrant = availableQuadrants[randomIndex];
          setActiveQuadrant(randomQuadrant);
          setShowActiveClass(true);
          setTimeout(() => {
            setShowActiveClass(false);
          }, 300);

          if (isTimerRunning && !isResting) {
            setRandomActionSignal();
          }
        }
      }, randomTime);
    };

    if (isTimerRunning && !isResting && !isPreRound) {
      setRandomActionSignal();
    }

    return () => {
      if (actionSignalTimer) {
        clearTimeout(actionSignalTimer);
      }
    };
  }, [isTimerRunning, isResting, isPreRound]);

  return (
    <div className={`app ${getAppClass()} ${countdownType}`}>
      <ActionBar
        isTimerRunning={isTimerRunning}
        replayRound={replayRound}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        formattedTime={formatTime(countdown)}
        countdownType={countdownType}
        currentRound={currentRound}
        totalRounds={NUMBER_OF_ROUNDS}
        countdown={countdown}
        roundTime={ROUND_TIME}
        restTime={REST_TIME}
        isPreRound={isPreRound}
        isActionBarVisible={isActionBarVisible}
        setIsActionBarVisible={setIsActionBarVisible}
      />
      <AimDot />
      <QuadrantGrid
        numberOfQuadrants={INITIAL_NUMBER_OF_QUADRANTS}
        activeQuadrant={activeQuadrant}
        showActiveClass={showActiveClass}
      />
    </div>
  );
};

export default App;
