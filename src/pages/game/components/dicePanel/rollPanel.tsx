import React from "react";
import RollButton from "./rollButton";
import DiceIcons from "./diceIcons";
import NextPlayerButton from "./nextPlayerButton";

const RollPanel: React.FC = () => {
  return (
    <div className="roll-panel">
      <RollButton />
      <NextPlayerButton />
      <DiceIcons />
    </div>
  );
};

export default RollPanel;
