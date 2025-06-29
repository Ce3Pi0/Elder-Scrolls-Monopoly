import React from "react";
import { Link } from "react-router";

const PlayButton: React.FC = () => (
  <Link to="/game-setup" className="button">
    <h2>Play</h2>
  </Link>
);

export default PlayButton;
