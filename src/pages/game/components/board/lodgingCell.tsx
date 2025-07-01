import React from "react";

const LodgingCell: React.FC = () => {
  const picture = "src/assets/images/lodge.png";

  return (
    <div className="tile">
      <div className="lodging-name">No Charge Lodging</div>
      <div className="lodging-picture">
        <img src={picture} />
      </div>
    </div>
  );
};

export default LodgingCell;
