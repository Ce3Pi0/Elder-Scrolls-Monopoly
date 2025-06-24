import React from "react";

const LeaderboardsButton: React.FC = () => (
  <button
    className="button"
    onClick={() => (window.location.href = "/leaderboards")}
  >
    <h1>Leaderboards</h1>
  </button>
);

export default LeaderboardsButton;
