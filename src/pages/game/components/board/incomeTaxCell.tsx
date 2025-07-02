import React from "react";
import PlayerDots from "./playerDots";
import type { CellProps } from "../../../../interfaces/interfaces";

const IncomeTaxCell: React.FC<CellProps> = ({
  playerPositions,
  tileIndex,
  colors,
}) => {
  return (
    <div className="income-tax-tile">
      <div className="income-tax-name">Income Tax</div>

      <div className="income-tax-price">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.6rem",
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Pay 20% or 200
            <img
              src="src/assets/icons/coinsIcon.png"
              style={{ width: "0.7rem", margin: "0.3rem" }}
            />
          </p>
        </span>
      </div>
      {/* TODO: Adjust values*/}
      <PlayerDots
        playerPositions={playerPositions}
        tileIndex={tileIndex}
        colors={colors}
      />
    </div>
  );
};

export default IncomeTaxCell;
