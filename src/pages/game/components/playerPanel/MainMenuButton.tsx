import React from "react";

const MainMenuButton: React.FC = () => {
  return (
    <button onClick={() => (window.location.href = "/")}>
      <h3>Main Menu</h3>
    </button>
  );
};

export default MainMenuButton;
