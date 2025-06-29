import React from "react";

import type { HeaderProps } from "../../../interfaces/interfaces";

import { IoMdVolumeHigh, IoMdHelpCircleOutline } from "react-icons/io";

import "../css/styles.css";

const Header: React.FC<HeaderProps> = ({ title }) => (
  <header className="shared-header">
    <div className="side-button">
      <IoMdVolumeHigh fill="black" className="volume-icon" />
    </div>

    <div className="title-row">
      <img
        className="icon"
        src="src/assets/icons/elderScrollsIcon.png"
        alt="Left icon"
      />
      <h1 className="title">{title}</h1>
      <img
        className="icon"
        src="src/assets/icons/elderScrollsIcon.png"
        alt="Right icon"
      />
    </div>

    <div className="side-button">
      <IoMdHelpCircleOutline
        fill="black"
        onClick={() => (window.location.href = "/gameRules")}
        className="help-icon"
      />
    </div>
  </header>
);

export default Header;

{
  /* TODO: add functionality to mute music */
}
