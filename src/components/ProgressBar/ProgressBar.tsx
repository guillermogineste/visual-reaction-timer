interface ProgressBarProps {
  currentRound: number;
  totalRounds: number;
  countdown: number;
  roundTime: number;
  countdownType: "round" | "rest";
  restTime: number;
  isPreRound: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentRound,
  totalRounds,
  countdown,
  roundTime,
  countdownType,
  restTime,
  isPreRound
}) => {
  const totalSegments = totalRounds * 2 - 1;
  const isRest = countdownType === "rest";
  const currentTime = isRest ? restTime : roundTime;
  const percentage = ((currentTime - countdown) / currentTime) * 100;

  return (
    <div
      className={`progress-bar ${isPreRound ? "pre-round" : ""}`}
      style={{
        gridTemplateColumns: Array.from({ length: totalSegments })
          .map((_, index) => {
            const isRoundSegment = index % 2 === 0;
            const segmentNumber = index + 1;
            if (
              isRoundSegment &&
              segmentNumber === currentRound * 2 - (isRest ? 0 : 1)
            ) {
              return "6fr";
            } else if (
              !isRoundSegment &&
              segmentNumber === currentRound * 2 &&
              isRest
            ) {
              return "2fr";
            }
            return index % 2 === 0 ? "3fr" : "1fr";
          })
          .join(" ")
      }}
    >
      {Array.from({ length: totalSegments }).map((_, index) => {
        const isRoundSegment = index % 2 === 0;
        const segmentNumber = index + 1;

        const segmentTypeClass = isRoundSegment ? "round" : "rest";
        let segmentStatusClass = "future";

        if (isRoundSegment) {
          if (segmentNumber < currentRound * 2 - (isRest ? 0 : 1)) {
            segmentStatusClass = "past";
          } else if (
            segmentNumber === currentRound * 2 - (isRest ? 0 : 1) &&
            !isRest
          ) {
            segmentStatusClass = "current";
          }
        } else {
          if (segmentNumber <= currentRound * 2 - (isRest ? 1 : 2)) {
            segmentStatusClass = "past";
          } else if (segmentNumber === currentRound * 2 && isRest) {
            segmentStatusClass = "current";
          }
        }

        const className = `segment ${segmentTypeClass} ${segmentStatusClass}`;

        const progressSpan =
          segmentStatusClass === "current" && !isPreRound ? (
            <span style={{ width: `${percentage}%` }}></span>
          ) : null;

        return (
          <div key={index} className={`${className} segment-${index + 1}`}>
            {progressSpan}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
