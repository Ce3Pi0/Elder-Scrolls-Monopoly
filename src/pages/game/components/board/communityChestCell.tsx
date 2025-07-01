import React from "react";

const CommunityChestCell: React.FC = () => {
  const picture = "src/assets/images/SkyrimChest.png";

  return (
    <div className="tile">
      <div className="community-chest-name">Community Chest</div>
      <div className="community-chest-picture">
        <img src={picture} />
      </div>
    </div>
  );
};

export default CommunityChestCell;
