import React from "react";
import type { DeedsProps } from "../../../../utils/interfaces";

const Deeds: React.FC<DeedsProps> = ({
  propertyDeeds,
  stablesDeeds,
  utilityDeeds,
}) => {
  const allDeeds = [...propertyDeeds, ...stablesDeeds, ...utilityDeeds];

  return allDeeds.map((deed) => {
    <div>Hi</div>;
  });
};

export default Deeds;
