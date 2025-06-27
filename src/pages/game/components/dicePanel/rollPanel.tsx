import React from "react";
import RollButton from "./rollButton";
import DiceIcons from "./diceIcons";

const RollPanel: React.FC = () => {
  return (
    <div className="roll-panel">
      <RollButton />
      <DiceIcons />
    </div>
  );
};

export default RollPanel;
