import React from "react";
import type { PlayerDotsProps } from "../../../../interfaces/interfaces";

const PlayerDots: React.FC<PlayerDotsProps> = ({
  tileIndex,
  playerPositions,
  colors,
}) => {
  return (
    <div className="player-dots-container">
      {playerPositions.map((pos, i) => {
        if (pos === tileIndex) {
          return (
            <div
              key={i}
              className="player-dot"
              style={{
                backgroundColor: colors[i],
                left: `${i * 12}px`,
                top: `${i * 12}px`,
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default PlayerDots;
