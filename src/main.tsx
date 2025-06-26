import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import Home from "./pages/home/home.tsx";
import GameSetup from "./pages/gameSetup/gameSetup";

import NotFound from "./pages/notFound/notFound.tsx";

import { GameProvider } from "./context/GameContext.tsx";

import "./index.css";
import Game from "./pages/game/game.tsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <GameProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game-setup" element={<GameSetup />} />
        {/* <Route path="/leaderboards" element={<Leaderboards />} /> */}
        <Route path="/game" element={<Game />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </GameProvider>
);
