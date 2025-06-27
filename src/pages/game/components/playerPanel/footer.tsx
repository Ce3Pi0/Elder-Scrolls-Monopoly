import React from "react";

import { IoMdVolumeHigh, IoMdHelpCircleOutline } from "react-icons/io";

import MainMenuButton from "./MainMenuButton";

const Footer: React.FC = () => {
  return (
    <footer className="player-panel-footer">
      <div className="quick-buttons">
        <IoMdVolumeHigh fill="black" className="volume-icon" />

        {/* TODO: add functionality to mute music */}
      </div>
      <MainMenuButton />
      <div className="quick-buttons">
        <IoMdHelpCircleOutline
          fill="black"
          onClick={() => (window.location.href = "/gameRules")}
          className="help-icon"
        />
      </div>
    </footer>
  );
};
export default Footer;
