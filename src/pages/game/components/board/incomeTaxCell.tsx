import React from "react";

const IncomeTaxCell: React.FC = () => {
  return (
    <div className="income-tax-tile">
      <div className="income-tax-name">Income Tax</div>

      <div className="income-tax-price">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.6rem",
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Pay 20% or 200
            <img
              src="src/assets/icons/coinsIcon.png"
              style={{ width: "0.7rem", margin: "0.3rem" }}
            />
          </p>
        </span>
      </div>
    </div>
  );
};

export default IncomeTaxCell;
