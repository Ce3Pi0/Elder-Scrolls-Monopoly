import React from "react";

const JailCell: React.FC = () => {
  const picture = "src/assets/images/jail.png";

  return (
    <div className="tile">
      <div className="jail-picture">
        <img src={picture} />
      </div>
      <div style={{ backgroundColor: "gray" }}>Jail</div>
      <div className="tile-name">Just Visiting</div>
    </div>
  );
};

export default JailCell;
