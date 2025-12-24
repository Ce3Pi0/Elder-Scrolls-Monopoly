import React from "react";
import PropertyCell from "./propertyCell";
import StableCell from "./stableCell";
import CommunityChestCell from "./communityChestCell";
import ChanceCell from "./chanceCell";
import IncomeTaxCell from "./incomeTaxCell";
import GoCell from "./goCell";
import JailCell from "./jailCell";
import UtilityCell from "./utilityCell";
import LuxuryTaxCell from "./luxuryTaxCell";
import GoToJailCell from "./goToJailCell";
import LodgingCell from "./lodgingCell";
import { BOARD_ARRAY } from "../../../../utils/constants";
import { isPropertyDeed } from "../../../../utils/helpers";

const Board: React.FC<{
  playerPositions: number[];
  colors: string[];
}> = ({ playerPositions, colors }) => {
  const rowOneArray = BOARD_ARRAY.slice(0, 10);
  const rowTwoArray = BOARD_ARRAY.slice(10, 20);
  const rowThreeArray = BOARD_ARRAY.slice(20, 30);
  const rowFourArray = BOARD_ARRAY.slice(30, 40);

  return (
    <div id="board">
      {/* <!--Row 1--> */}
      <div className="row" id="row-0">
        {rowOneArray.map((data) => {
          switch (data.cellType) {
            case "PROPERTY":
              return (
                <PropertyCell
                  key={data.id}
                  id={data.id}
                  city={data.deed!.getDeedName()}
                  region={
                    isPropertyDeed(data.deed) ? data.deed!.getRegion() : ""
                  }
                  name={data.deed!.getDeedName()}
                  price={data.deed!.getPrice()}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "START":
              return (
                <GoCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "COMMUNITY":
              return (
                <CommunityChestCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "CHANCE":
              return (
                <ChanceCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "INCOME_TAX":
              return (
                <IncomeTaxCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "STABLES":
              return (
                <StableCell
                  key={data.id}
                  id={data.id}
                  name={data.deed!.getDeedName()}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
          }
        })}
      </div>

      {/* <!--Row 2--> */}
      <div className="row" id="row-1">
        {rowTwoArray.map((data) => {
          switch (data.cellType) {
            case "PROPERTY":
              return (
                <PropertyCell
                  key={data.id}
                  id={data.id}
                  city={data.deed!.getDeedName()}
                  region={
                    isPropertyDeed(data.deed) ? data.deed!.getRegion() : ""
                  }
                  name={data.deed!.getDeedName()}
                  price={data.deed!.getPrice()}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "COMMUNITY":
              return (
                <CommunityChestCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "STABLES":
              return (
                <StableCell
                  key={data.id}
                  id={data.id}
                  name={data.deed!.getDeedName()}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "UTILITY":
              return (
                <UtilityCell
                  id={data.id}
                  name={data.deed!.getDeedName()}
                  utility={data.deed!.getDeedName()}
                  type={data.deed!.getDeedName()}
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "JAIL":
              return (
                <JailCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
          }
        })}
      </div>

      {/* <!--Row 3--> */}
      <div className="row" id="row-2">
        {rowThreeArray.map((data) => {
          switch (data.cellType) {
            case "PROPERTY":
              return (
                <PropertyCell
                  key={data.id}
                  id={data.id}
                  city={data.deed!.getDeedName()}
                  region={
                    isPropertyDeed(data.deed) ? data.deed!.getRegion() : ""
                  }
                  name={data.deed!.getDeedName()}
                  price={data.deed!.getPrice()}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "LODGING":
              return (
                <LodgingCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "CHANCE":
              return (
                <ChanceCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "COMMUNITY":
              return (
                <CommunityChestCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "STABLES":
              return (
                <StableCell
                  key={data.id}
                  id={data.id}
                  name={data.deed!.getDeedName()}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "UTILITY":
              return (
                <UtilityCell
                  id={data.id}
                  name={data.deed!.getDeedName()}
                  utility={data.deed!.getDeedName()}
                  type={data.deed!.getDeedName()}
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
          }
        })}
      </div>

      {/* <!--Row 4--> */}
      <div className="row" id="row-3">
        {rowFourArray.map((data) => {
          switch (data.cellType) {
            case "PROPERTY":
              return (
                <PropertyCell
                  key={data.id}
                  id={data.id}
                  city={data.deed!.getDeedName()}
                  region={
                    isPropertyDeed(data.deed) ? data.deed!.getRegion() : ""
                  }
                  name={data.deed!.getDeedName()}
                  price={data.deed!.getPrice()}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "CHANCE":
              return (
                <ChanceCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "STABLES":
              return (
                <StableCell
                  key={data.id}
                  id={data.id}
                  name={data.deed!.getDeedName()}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "GO_TO_JAIL":
              return (
                <GoToJailCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
            case "LUXURY_TAX":
              return (
                <LuxuryTaxCell
                  key={data.id}
                  playerPositions={playerPositions}
                  tileIndex={data.id}
                  colors={colors}
                />
              );
          }
        })}
      </div>
    </div>
  );
};

export default Board;
