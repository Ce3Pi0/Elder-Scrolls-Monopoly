import React from "react";
import type { PlayerProps } from "../../../../utils/interfaces";
import { PLAYER_COLORS, PLAYER_ICONS } from "../../../../utils/utils";
import { useGameContext } from "../../../../context/GameContext";

const PlayerComponent: React.FC<PlayerProps> = ({
  id,
  name,
  color,
  icon,
  usedData,
}) => {
  const [inputValue, setInputValue] = React.useState<string>(name);
  const [selectedColor, setSelectedColor] = React.useState<number>(color);
  const [selectedIcon, setSelectedIcon] = React.useState<number>(icon);

  const { state, dispatch, loaded } = useGameContext();

  if (!loaded) return <div>Loading game setup...</div>;
  if (loaded && !state.game) return <div>Failed to Fetch</div>;

  return (
    <div className="player">
      <div className="playerName">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            dispatch({
              type: "UPDATE_PLAYER",
              payload: {
                id: id,
                name: e.target.value,
                color: color,
                icon: icon,
              },
            });
            setInputValue(e.target.value);
          }}
        />
      </div>
      <div className="player-icon">
        <select
          onChange={(e) => {
            dispatch({
              type: "UPDATE_PLAYER",
              payload: {
                id: id,
                name: name,
                color: color,
                icon: e.target.value,
              },
            });
            setSelectedIcon(parseInt(e.target.value));
          }}
          style={{
            backgroundImage: `url(../../../../../${PLAYER_ICONS[selectedIcon][0]})`,
          }}
        >
          <option
            value={selectedIcon}
            style={{
              backgroundImage: `url(../../../../../${PLAYER_ICONS[selectedIcon][0]})`,
            }}
          >
            {PLAYER_ICONS[selectedIcon][1]}
          </option>
          {Object.entries(PLAYER_ICONS).map(([key, value]) => {
            const iconKey = parseInt(key);
            if (
              iconKey !== selectedIcon &&
              usedData.icons.indexOf(iconKey) === -1
            ) {
              return (
                <option
                  key={iconKey}
                  value={iconKey}
                  style={{
                    backgroundColor: value[0],
                  }}
                  onClick={() => setSelectedColor(iconKey)}
                >
                  {value[1]}
                </option>
              );
            }
            return null;
          })}
        </select>
      </div>
      <div
        className="player-color"
        style={{
          backgroundColor: PLAYER_COLORS[selectedColor][0],
        }}
      >
        <select
          onChange={(e) => {
            dispatch({
              type: "UPDATE_PLAYER",
              payload: {
                id: id,
                name: name,
                color: e.target.value,
                icon: icon,
              },
            });
            setSelectedColor(parseInt(e.target.value));
          }}
        >
          <option
            value={selectedColor}
            style={{
              backgroundColor: PLAYER_COLORS[selectedColor][0],
            }}
          >
            {PLAYER_COLORS[selectedColor][1]}
          </option>
          {Object.entries(PLAYER_COLORS).map(([key, value]) => {
            const colorKey = parseInt(key);
            if (
              colorKey !== selectedColor &&
              usedData.colors.indexOf(colorKey) === -1
            ) {
              return (
                <option
                  key={colorKey}
                  value={colorKey}
                  style={{
                    backgroundColor: value[0],
                  }}
                  onClick={() => setSelectedColor(colorKey)}
                >
                  {value[1]}
                </option>
              );
            }
            return null;
          })}
        </select>
      </div>
    </div>
  );
};

export default PlayerComponent;
