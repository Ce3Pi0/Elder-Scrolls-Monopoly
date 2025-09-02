import React from "react";

import type { NumberOfPlayersSectionProps } from "../../../../utils/interfaces";

const NumberOfPlayersSection: React.FC<NumberOfPlayersSectionProps> = ({
  playerCount,
  setPlayerCount,
}) => {
  const handlePlayerCountChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const count = parseInt(event.target.value, 10);
    setPlayerCount(count);
  };

  return (
    <div className="number-of-players">
      <div className="number-of-players-header"> Number of Players </div>
      <div className="number-of-players-options">
        <select
          value={playerCount}
          onChange={handlePlayerCountChange}
          className="player-count-select"
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
    </div>
  );
};

export default NumberOfPlayersSection;
