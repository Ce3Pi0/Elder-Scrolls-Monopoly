import React from "react";
import RollPanel from "./rollPanel";
import ScorePanel from "./scorePanel";

const DicePanel: React.FC = () => {
  return (
    <div className="dice-panel-inner">
      <RollPanel />
      <ScorePanel />
    </div>
  );
};

export default DicePanel;
