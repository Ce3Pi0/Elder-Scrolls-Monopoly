import React from "react";

const ChanceCell: React.FC = () => {
  const picture = "src/assets/images/questionmark.png";

  return (
    <div className="tile">
      <div className="chance-name">Chance</div>
      <div className="chance-picture">
        <img src={picture} />
      </div>
    </div>
  );
};

export default ChanceCell;
