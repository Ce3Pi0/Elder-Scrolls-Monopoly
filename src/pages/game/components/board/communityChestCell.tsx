import React from "react";
import PlayerDots from "./playerDots";
import type { CellProps } from "../../../../utils/interfaces";

const CommunityChestCell: React.FC<CellProps> = ({
  playerPositions,
  tileIndex,
  colors,
}) => {
  const picture = "src/assets/images/SkyrimChest.png";

  return (
    <div className="tile">
      <div className="community-chest-name">Community Chest</div>
      <div className="community-chest-picture">
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

export default CommunityChestCell;
