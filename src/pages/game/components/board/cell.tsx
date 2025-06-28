import React from "react";
import type { CellProps } from "../../../../interfaces/interfaces";

const Cell: React.FC<CellProps> = ({ picture, color, name, price }) => {
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
    </div>
  );
};

export default Cell;
