import React from "react";
import "../styles/MovieCastCard.css";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";

function MovieCastCard(props) {
  return (
    <div className="movie_cast_card_wrapper">
      <div className="cast_card">
        <img
          className="cast_card_child cast_card__image"
          src={`${IMAGE_URL}/${props.profile_path}`}
          alt={props.name}
        />
        <div className="cast_card_child cast_card__content">
          <h3 className="card_title">{props.name}</h3>
          <p className="cast_card__overview">
            <b>Character:</b> {props.character}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieCastCard;
