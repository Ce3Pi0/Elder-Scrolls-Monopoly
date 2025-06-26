import React from "react";

import PlayButton from "./playButton";
import LeaderboardsButton from "./leaderboardsButton";

const Body: React.FC = () => (
  <div className="home-body">
    <PlayButton />
    <LeaderboardsButton />
  </div>
);

export default Body;
