import React from "react";
import PlayerDots from "./playerDots";
import type { CellProps } from "../../../../utils/interfaces";

const ChanceCell: React.FC<CellProps> = ({
  playerPositions,
  tileIndex,
  colors,
}) => {
  const picture = "src/assets/images/questionmark.png";

  return (
    <div className="tile">
      <div className="chance-name">Chance</div>
      <div className="chance-picture">
        <img src={picture} />
      </div>
      <PlayerDots
        playerPositions={playerPositions}
        tileIndex={tileIndex}
        colors={colors}
      />
    </div>
  );
};

export default ChanceCell;
