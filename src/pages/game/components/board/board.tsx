import React from "react";
import PropertyCell from "./propertyCell";
import StableCell from "./stableCell";
import CommunityChestCell from "./communityChestCell";
import ChanceCell from "./chanceCell";
import IncomeTaxCell from "./incomeTaxCell";
import GoCell from "./goCell";
import { BoardArray, isPropertyDeed } from "../../../../utils/utils";
import JailCell from "./jailCell";
import UtilityCell from "./utilityCell";
import LuxuryTaxCell from "./luxuryTaxCell";
import GoToJailCell from "./goToJailCell";
import LodgingCell from "./lodgingCell";

const Board: React.FC = () => {
  const rowOneArray = BoardArray.slice(0, 10);
  const rowTwoArray = BoardArray.slice(10, 20);
  const rowThreeArray = BoardArray.slice(20, 30);
  const rowFourArray = BoardArray.slice(30, 40);

  return (
    <div id="board">
      {/* <!--Row 1--> */}
      <div className="row" id="row-0">
        {rowOneArray.map((data) => {
          switch (data.actionType) {
            case "property":
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
                />
              );
            case "start":
              return <GoCell key={data.id} />;
            case "community":
              return <CommunityChestCell key={data.id} />;
            case "chance":
              return <ChanceCell key={data.id} />;
            case "incomeTax":
              return <IncomeTaxCell key={data.id} />;
            case "stables":
              return (
                <StableCell
                  key={data.id}
                  id={data.id}
                  name={data.deed!.getDeedName()}
                />
              );
          }
        })}
      </div>

      {/* <!--Row 2--> */}
      <div className="row" id="row-1">
        {rowTwoArray.map((data) => {
          switch (data.actionType) {
            case "property":
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
                />
              );
            case "community":
              return <CommunityChestCell key={data.id} />;
            case "stables":
              return (
                <StableCell
                  key={data.id}
                  id={data.id}
                  name={data.deed!.getDeedName()}
                />
              );
            case "utility":
              return (
                <UtilityCell
                  id={data.id}
                  name={data.deed!.getDeedName()}
                  utility={data.deed!.getDeedName()}
                  type={data.deed!.getDeedName()}
                  key={data.id}
                />
              );
            case "jail":
              return <JailCell key={data.id} />;
          }
        })}
      </div>

      {/* <!--Row 3--> */}
      <div className="row" id="row-2">
        {rowThreeArray.map((data) => {
          switch (data.actionType) {
            case "property":
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
                />
              );
            case "lodging":
              return <LodgingCell key={data.id} />;
            case "chance":
              return <ChanceCell key={data.id} />;
            case "community":
              return <CommunityChestCell key={data.id} />;
            case "stables":
              return (
                <StableCell
                  key={data.id}
                  id={data.id}
                  name={data.deed!.getDeedName()}
                />
              );
            case "utility":
              return (
                <UtilityCell
                  id={data.id}
                  name={data.deed!.getDeedName()}
                  utility={data.deed!.getDeedName()}
                  type={data.deed!.getDeedName()}
                  key={data.id}
                />
              );
          }
        })}
      </div>

      {/* <!--Row 4--> */}
      <div className="row" id="row-3">
        {rowFourArray.map((data) => {
          switch (data.actionType) {
            case "property":
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
                />
              );
            case "chance":
              return <ChanceCell key={data.id} />;
            case "stables":
              return (
                <StableCell
                  key={data.id}
                  id={data.id}
                  name={data.deed!.getDeedName()}
                />
              );
            case "goToJail":
              return <GoToJailCell key={data.id} />;
            case "luxuryTax":
              return <LuxuryTaxCell key={data.id} />;
          }
        })}
      </div>
    </div>
  );
};

export default Board;
