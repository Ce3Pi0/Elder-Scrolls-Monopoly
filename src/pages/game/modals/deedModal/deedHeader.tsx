import React from "react";
import type { DeedHeaderProps } from "../../../../interfaces/interfaces";
import ModalPlayerInfo from "./modalPlayerInfo";

const DeedHeader: React.FC<DeedHeaderProps> = ({
  icon,
  name,
  balance,
  getOutOfJailFreeCardsCount,
}) => {
  return (
    <div className="deed-modal-header">
      <ModalPlayerInfo icon={icon} name={name} balance={balance} />
      <h1 style={{ width: "30%" }}>Deeds & Properties</h1>
      <h2 style={{ width: "30%" }}>
        Get Out Of Jail Free Cards: {getOutOfJailFreeCardsCount || 0}
      </h2>
    </div>
  );
};

export default DeedHeader;
