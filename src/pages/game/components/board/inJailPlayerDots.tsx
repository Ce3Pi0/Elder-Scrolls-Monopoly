import React from "react";
import type { PlayerDotsProps } from "../../../../interfaces/interfaces";
import { useGameContext } from "../../../../context/GameContext";

const InJailPlayerDots: React.FC<PlayerDotsProps> = ({
  tileIndex,
  playerPositions,
  colors,
}) => {
  const { state } = useGameContext();

  return (
    <div className="player-dots-container">
      {playerPositions.map((pos, i) => {
        if (pos === tileIndex && state.game?.getPlayerById(i)?.isInJail()) {
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

export default InJailPlayerDots;
