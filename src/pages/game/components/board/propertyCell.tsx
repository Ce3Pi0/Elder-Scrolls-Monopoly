import React from "react";
import type { PropertyCellProps } from "../../../../utils/interfaces";
import PlayerDots from "./playerDots";
import { citiesToPictures, regionsToColors } from "../../../../utils/helpers";

const PropertyCell: React.FC<PropertyCellProps> = ({
  playerPositions,
  tileIndex,
  colors,
  city,
  region,
  name,
  price,
}) => {
  const color = regionsToColors(region);
  const picture = citiesToPictures(city);

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
