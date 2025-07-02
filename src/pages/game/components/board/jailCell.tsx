import React from "react";
import PlayerDots from "./playerDots";
import type { CellProps } from "../../../../interfaces/interfaces";

const JailCell: React.FC<CellProps> = ({
  playerPositions,
  tileIndex,
  colors,
}) => {
  const picture = "src/assets/images/jail.png";

  return (
    <div className="tile">
      <div className="jail-picture">
        <img src={picture} />
      </div>
      {/* TODO: Add if is in jail check values*/}
      <PlayerDots
        playerPositions={playerPositions}
        tileIndex={tileIndex}
        colors={colors}
      />
      <div style={{ backgroundColor: "gray" }}>Jail</div>
      <div className="tile-name">Just Visiting</div>
      <PlayerDots
        playerPositions={playerPositions}
        tileIndex={tileIndex}
        colors={colors}
      />
    </div>
  );
};

export default JailCell;
