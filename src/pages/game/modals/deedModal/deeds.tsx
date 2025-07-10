import React from "react";
import type { DeedsProps } from "../../../../interfaces/interfaces";

const Deeds: React.FC<DeedsProps> = ({
  propertyDeeds,
  stablesDeeds,
  utilityDeeds,
}) => {
  const allDeeds = [...propertyDeeds, ...stablesDeeds, ...utilityDeeds];

  console.log(allDeeds);

  return null;

  // return allDeeds.map((deed) => {
  //   return <div>Hi</div>;
  // });
};

export default Deeds;
