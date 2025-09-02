import React from "react";
import PlayerDots from "./playerDots";
import type { CellProps } from "../../../../utils/interfaces";

const GoToJailCell: React.FC<CellProps> = ({
  playerPositions,
  tileIndex,
  colors,
}) => {
  const picture = "src/assets/images/guard.png";

  return (
    <div className="tile">
      <div className="jail-picture">
        <img src={picture} />
      </div>
      <div className="tile-name">Go To Jail!</div>
      <PlayerDots
        playerPositions={playerPositions}
        tileIndex={tileIndex}
        colors={colors}
      />
    </div>
  );
};

export default GoToJailCell;
