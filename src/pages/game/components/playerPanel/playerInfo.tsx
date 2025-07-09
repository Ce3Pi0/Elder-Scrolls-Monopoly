import React from "react";
import type { PlayerInfoProps } from "../../../../interfaces/interfaces";

const PlayerInfo: React.FC<PlayerInfoProps> = ({ name, balance }) => {
  return (
    <div className="player-info">
      <h4 className="player-name">{name}</h4>
      <p
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          gap: "0.25rem",
        }}
      >
        <span
          style={{
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
          }}
        >
          Total
        </span>
        <img src="src/assets/icons/coinsIcon.png" style={{ width: "1rem" }} />{" "}
        <span
          style={{
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
          }}
        >
          : {balance}
        </span>
      </p>
    </div>
  );
};

export default PlayerInfo;
