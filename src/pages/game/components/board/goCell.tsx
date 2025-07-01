import React from "react";

const GoCell: React.FC = () => {
  const picture1 = "src/assets/images/coins.png";
  const picture2 = "src/assets/images/arrow.png";

  return (
    <div className="tile">
      <div className="community-chest-name">Collect 200 coins as you pass</div>
      <div className="go-picture">
        <img style={{ rotate: "-135deg" }} src={picture2} />
        <img src={picture1} />{" "}
      </div>
    </div>
  );
};

export default GoCell;
