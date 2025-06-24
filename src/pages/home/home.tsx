import React from "react";

import Header from "../shared/header/header";
import Body from "./components/body/body.tsx";

import "./css/styles.css";

const Home: React.FC = () => (
  <div className="home-page">
    <Header title={"Monopoly Game"} />
    <Body />
  </div>
);

export default Home;
