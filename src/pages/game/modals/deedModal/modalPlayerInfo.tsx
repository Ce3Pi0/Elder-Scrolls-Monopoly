import React from "react";
import type { ModalPlayerInfoProps } from "../../../../interfaces/interfaces";
import { PLAYER_ICONS } from "../../../../utils/utils";

const ModalPlayerInfo: React.FC<ModalPlayerInfoProps> = ({
  icon,
  name,
  balance,
}) => {
  const playerIcon: string = PLAYER_ICONS[icon][0];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "space-between",
        width: "30%",
      }}
    >
      <div>
        <img src={playerIcon} style={{ width: "3rem" }} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          paddingLeft: "1em",
        }}
      >
        <h2 style={{ margin: "0" }}>{name}</h2>
        <p style={{ margin: "0" }}>
          Total{" "}
          <img src="src/assets/icons/coinsIcon.png" style={{ width: "1rem" }} />
          :{balance}
        </p>
      </div>
    </div>
  );
};

export default ModalPlayerInfo;
