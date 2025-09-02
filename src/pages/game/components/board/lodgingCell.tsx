import React from "react";
import PlayerDots from "./playerDots";
import type { CellProps } from "../../../../utils/interfaces";

const LodgingCell: React.FC<CellProps> = ({
  playerPositions,
  tileIndex,
  colors,
}) => {
  const picture = "src/assets/images/lodge.png";

  return (
    <div className="tile">
      <div className="lodging-name">No Charge Lodging</div>
      <div className="lodging-picture">
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

export default LodgingCell;
