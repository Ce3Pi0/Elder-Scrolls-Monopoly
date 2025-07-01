import React from "react";
import type { StableCellProps } from "../../../../interfaces/interfaces";

const StableCell: React.FC<StableCellProps> = ({ id, name }) => {
  const picture = "src/assets/images/stables.png";

  return (
    <div className="tile">
      <div className="stables-name">{name}</div>
      <div className="stables-picture">
        <img src={picture} />
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
          200
          <img
            src="src/assets/icons/coinsIcon.png"
            style={{ width: "0.7rem", margin: "0.3rem" }}
          />
        </span>
      </div>
    </div>
  );
};

export default StableCell;
