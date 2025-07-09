import React from "react";
import type { DeedsProps } from "../../../../interfaces/interfaces";

const Deeds: React.FC<DeedsProps> = ({
  propertyDeeds,
  stablesDeeds,
  utilityDeeds,
}) => {
  const allDeeds = [...propertyDeeds, ...stablesDeeds, ...utilityDeeds];

  return allDeeds.map((deed) => {
    return <div>{deed.getDeedName()}</div>;
  });
};

export default Deeds;
