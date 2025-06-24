import React from "react";

const MainMenuButton: React.FC = () => {
  return (
    <button onClick={() => (window.location.href = "/")}>
      <h1>Main Menu</h1>
    </button>
  );
};

export default MainMenuButton;
