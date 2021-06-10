import YouTube from "react-youtube";
import React, { useEffect, useState } from "react";
import { getMovieVideoId } from "../utils";

const opts = {
  height: "275",
  width: "100%",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    fs: 0,
  },
};

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";

function InputMovieCard(props) {
  const [movieVideoInfo, setMovieVideoInfo] = useState(null);

  useEffect(() => {
    const loadVideoInfo = async () => {
      const videoInfo = await getMovieVideoId(props.id);
      setMovieVideoInfo(videoInfo);
    };

    loadVideoInfo();
  }, [props.id]);

  return (
    <div className="input_movie_container">
      <div className="input_movie_card">
        <img
          className="input_poster"
          src={`${BASE_IMAGE_URL}${props.poster_path}`}
          alt={props.title}
        />
        <div className="card_content">
          <h1 className="card_title">{props.title || props.original_title}</h1>
          <br />
          {/* Youtube Video */}
          {movieVideoInfo && (
            <>
              <h2>{movieVideoInfo.name}</h2>
              <YouTube videoId={movieVideoInfo.videoId} opts={opts} />
            </>
          )}
          {/* {props.genres && (
            <p>
              <b>Genre: </b>
              {props.genres.map((genre) => {
                return <>{genre}</>;
              })}
            </p>
          )} */}
          <p>
            <b>Rating: </b>
            {props.vote_average}/10 ( <span>{props.vote_count} Votes</span> )
          </p>
          <p className="card_overview">
            <b>
              Overview:
              <br />
            </b>
            {props.overview}
          </p>
          <p>
            <b>Status: </b>
            {props.status}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InputMovieCard;
