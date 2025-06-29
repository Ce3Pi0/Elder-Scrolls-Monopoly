import React from "react";
import { Link } from "react-router";

const MainMenuButton: React.FC = () => {
  return (
    <Link to="/" className="button" style={{ marginTop: "2rem" }}>
      <h2>Main Menu</h2>
    </Link>
  );
};

export default MainMenuButton;
