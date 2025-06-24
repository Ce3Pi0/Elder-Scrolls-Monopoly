import React from "react";

import type { HeaderProps } from "../../../interfaces/interfaces";

import { IoMdVolumeHigh, IoMdHelpCircleOutline } from "react-icons/io";

import "../css/styles.css";

const Header: React.FC<HeaderProps> = ({ title }) => (
  <header>
    <div className="quick-buttons">
      <IoMdVolumeHigh fill="black" className="volume-icon" />

      {/* TODO: add functionality to mute music */}
    </div>
    <div>
      <img className="icons" src="src/assets/icons/elderScrollsIcon.png" />
    </div>
    <div className="title">
      <h1>{title}</h1>
    </div>
    <div>
      <img className="icons" src="src/assets/icons/elderScrollsIcon.png" />
    </div>
    <div className="quick-buttons">
      <IoMdHelpCircleOutline
        fill="black"
        onClick={() => (window.location.href = "/gameRules")}
      />
    </div>
  </header>
);

export default Header;
