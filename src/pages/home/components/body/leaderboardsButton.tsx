import React from "react";
import { Link } from "react-router";

const LeaderboardsButton: React.FC = () => (
  <Link to="/leaderboards" className="button">
    <h2>Leaderboards</h2>
  </Link>
);

export default LeaderboardsButton;
