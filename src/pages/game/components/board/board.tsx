import React from "react";
import Cell from "./cell";

const Board: React.FC = () => {
  return (
    <div id="board">
      {/* <!--Row 1--> */}
      <div className="row" id="row-0">
        {[...Array(9)].map((_, i) => (
          <Cell
            key={i}
            id={i}
            picture="/src/assets/images/ImperialCity.png"
            color="#4EA8A0"
            name="Imperial City"
            price={100}
          />
        ))}
      </div>

      {/* <!--Row 2--> */}
      <div className="row" id="row-1">
        {[...Array(9)].map((_, i) => (
          <Cell
            key={i}
            id={i}
            picture="test"
            color="red"
            name="Test"
            price={100}
          />
        ))}
      </div>

      {/* <!--Row 3--> */}
      <div className="row" id="row-2">
        {[...Array(9)].map((_, i) => (
          <Cell
            key={i}
            id={i}
            picture="test"
            color="red"
            name="Test"
            price={100}
          />
        ))}
      </div>

      {/* <!--Row 4--> */}
      <div className="row" id="row-3">
        {[...Array(9)].map((_, i) => (
          <Cell
            key={i}
            id={i}
            picture="test"
            color="red"
            name="Test"
            price={100}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
