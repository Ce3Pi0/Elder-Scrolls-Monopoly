import React from "react";
import PlayerDots from "./playerDots";
import type { CellProps } from "../../../../interfaces/interfaces";

const GoCell: React.FC<CellProps> = ({
  playerPositions,
  tileIndex,
  colors,
}) => {
  const picture1 = "src/assets/images/coins.png";
  const picture2 = "src/assets/images/arrow.png";

  return (
    <div className="tile" style={{ position: "relative" }}>
      <div className="community-chest-name">Collect 200 coins as you pass</div>
      <div className="go-picture">
        <img style={{ rotate: "-135deg" }} src={picture2} />
        <img src={picture1} />{" "}
      </div>
      <PlayerDots
        playerPositions={playerPositions}
        tileIndex={tileIndex}
        colors={colors}
      />
    </div>
  );
};

export default GoCell;
