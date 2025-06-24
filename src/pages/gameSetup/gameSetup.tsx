import React from "react";

import Header from "../shared/header/header";
import Footer from "../shared/footer/footer";
import Body from "./components/body/body";

import "./css/styles.css"; // Import the CSS file for styling

const GameSetup: React.FC = () => {
  return (
    <div className="game-setup">
      <Header title="Game Setup" />
      <Body />
      <Footer />
    </div>
  );
};

export default GameSetup;
