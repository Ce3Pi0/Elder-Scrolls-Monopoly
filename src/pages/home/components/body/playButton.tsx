import React from "react";

const PlayButton: React.FC = () => (
  <button
    className="button"
    onClick={() => (window.location.href = "/game-setup")}
  >
    <h1>Play</h1>
  </button>
);

export default PlayButton;
