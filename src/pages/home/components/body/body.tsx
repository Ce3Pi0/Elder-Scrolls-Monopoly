import React from "react";

import PlayButton from "./PlayButton";
import LeaderboardsButton from "./LeaderboardsButton";

const Body: React.FC = () => (
  <div className="home-body">
    <PlayButton />
    <LeaderboardsButton />
  </div>
);

export default Body;
