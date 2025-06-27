import React from "react";
import type { GamePlayerData } from "../../../../interfaces/interfaces";
import { PLAYER_COLORS, PLAYER_ICONS } from "../../../../utils/utils";

const Player: React.FC<GamePlayerData> = ({
  id,
  color,
  name,
  icon,
  balance,
}) => {
  const colorCode = PLAYER_COLORS[color];
  const iconCode = PLAYER_ICONS[icon];

  return (
    <div key={id} className="player-element">
      <div className="player-color" style={{ backgroundColor: colorCode[0] }} />
      <div
        className="game-player-icon"
        style={{
          width: "3rem",
          height: "3rem",
          marginLeft: "1rem",
          backgroundImage: `url(../../../../../${iconCode[0]})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "60%",
          backgroundPosition: "center",
        }}
      />
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
      <div className="deed-icon">
        <img src="src/assets/icons/deedIcon.png" />
      </div>
    </div>
  );
};

export default Player;
