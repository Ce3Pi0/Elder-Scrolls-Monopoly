import React from "react";
import {
  UTILITIES_TO_LOGOS,
  UTILITIES_TO_PICTURES,
} from "../../../../utils/utils";
import type { UtilityCellProps } from "../../../../interfaces/interfaces";
import PlayerDots from "./playerDots";

const UtilityCell: React.FC<UtilityCellProps> = ({
  playerPositions,
  tileIndex,
  colors,
  utility,
  type,
  name,
}) => {
  const picture = UTILITIES_TO_PICTURES[utility];
  const logo = UTILITIES_TO_LOGOS[type];

  return (
    <div className="tile">
      <div className="utility-name">{name}</div>
      <div className="utility-picture">
        <img className="utility-picture-img" src={picture} />
        <img className="utility-logo-img" src={logo} />
      </div>
      <div className="tile-price">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "0.5rem",
          }}
        >
          {150}
          <img
            src="src/assets/icons/coinsIcon.png"
            style={{ width: "0.7rem", margin: "0.3rem" }}
          />
        </span>
      </div>
      <PlayerDots
        playerPositions={playerPositions}
        tileIndex={tileIndex}
        colors={colors}
      />
    </div>
  );
};

export default UtilityCell;
