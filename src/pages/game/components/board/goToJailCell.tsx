import React from "react";

const GoToJailCell: React.FC = () => {
  const picture = "src/assets/images/guard.png";

  return (
    <div className="tile">
      <div className="jail-picture">
        <img src={picture} />
      </div>
      <div className="tile-name">Go To Jail!</div>
    </div>
  );
};

export default GoToJailCell;
