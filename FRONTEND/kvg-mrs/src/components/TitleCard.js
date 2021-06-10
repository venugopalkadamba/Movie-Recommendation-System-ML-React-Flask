import React from "react";
import "../styles/TitleCard.css";

function TitleCard() {
  return (
    <div className="title_card_wrapper">
      <div className="title_card">
        <img
          className="title_logo"
          src={`${process.env.PUBLIC_URL}/assets/logo.png`}
          alt="logo"
        />
        <h1 className="title">KVG Movie Zone</h1>
        <img
          className="title_logo"
          src={`${process.env.PUBLIC_URL}/assets/logo.png`}
          alt="logo"
        />
      </div>
    </div>
  );
}

export default TitleCard;
