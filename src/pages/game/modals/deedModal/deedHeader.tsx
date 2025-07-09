import React from "react";
import type { DeedHeaderProps } from "../../../../interfaces/interfaces";

const DeedHeader: React.FC<DeedHeaderProps> = ({
  icon,
  name,
  balance,
  getOutOfJailFreeCardsCount,
}) => {
  return (
    <div>
      {icon} {name} {balance} {getOutOfJailFreeCardsCount}
    </div>
  );
};

export default DeedHeader;
