import React from "react";
import type { PropertyCellProps } from "../../../../interfaces/interfaces";
import { REGIONS_TO_COLORS, CITIES_TO_PICTURES } from "../../../../utils/utils";
import PlayerDots from "./playerDots";

const PropertyCell: React.FC<PropertyCellProps> = ({
  playerPositions,
  tileIndex,
  colors,
  city,
  region,
  name,
  price,
}) => {
  const color = REGIONS_TO_COLORS[region];
  const picture = CITIES_TO_PICTURES[city];

  return (
    <div className="tile">
      <div className="tile-picture">
        <img src={picture} />
      </div>
      <div className="tile-color" style={{ backgroundColor: color }} />
      <div className="tile-name">{name}</div>
      <div className="tile-price">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "0.5rem",
          }}
        >
          {price}
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

export default PropertyCell;
