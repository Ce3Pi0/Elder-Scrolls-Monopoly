import React from "react";
import PlayerDots from "./playerDots";
import type { CellProps } from "../../../../utils/interfaces";

const LuxuryTaxCell: React.FC<CellProps> = ({
  playerPositions,
  tileIndex,
  colors,
}) => {
  const picture = "src/assets/images/LuxuryTax.png";

  return (
    <div className="tile">
      <div className="tile-name">Luxury Tax</div>
      <div className="luxury-tax-picture">
        <img src={picture} />
      </div>
      <div className="luxury-tax-price">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "0.5rem",
          }}
        >
          pay {150}
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

export default LuxuryTaxCell;
