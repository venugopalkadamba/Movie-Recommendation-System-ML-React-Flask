import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import movie_names from "./movie_names.json";
import {
  getMovieCastData,
  getMovieData,
  getRecommendedMoviesData,
} from "./utils";
import recommender_api from "./api/recommenderapi";
import "./App.css";
import { Button } from "@material-ui/core";
import RowMovieCard from "./components/RowMovieCard";
import InputMovieCard from "./components/InputMovieCard";
import MovieCastCard from "./components/MovieCastCard";
import ReviewsCard from "./components/ReviewsCard";
import AboutMe from "./components/AboutMe";
import TitleCard from "./components/TitleCard";
import ReviewLoading from "./components/ReviewLoading";
import Loading from "./components/Loading";
import Error from "./components/Error";

function App() {
  const [movies, setMovies] = useState([]);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState(null);
  const [inputMovieData, setInputMovieData] = useState(null);
  const [castData, setCastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovieNames = () => {
      setMovies(movie_names.movie_names);
    };

    const dummieAPIRequest = async () => {
      await recommender_api.get("/");
    };

    loadMovieNames();
    dummieAPIRequest();
  }, []);

  const onChangeHandler = (text_value) => {
    let matches = [];
    if (text_value.length > 0) {
      matches = movies.filter((movie) => {
        const regex = new RegExp(`${text}`, "gi");
        return movie.title.match(regex);
      });
    }

    if (matches.length > 10) matches = matches.slice(0, 8);

    setSuggestions(matches);
    setText(text_value);
  };

  const onSuggestHandler = (text_value) => {
    setText(text_value);
    setSuggestions(null);
  };

  const movieHandler = async (movie_name) => {
    setLoading(true);
    setError(null);

    const request = new FormData();
    request.append("movie_name", movie_name);
    request.append("number_of_recommendations", 10);

    const response = await recommender_api.post("/recommend_movie", request);

    const responseData = response.data;
    if (responseData.error) {
      setError(responseData.error);
    } else {
      const movie_data = await getMovieData(responseData.input_movie.movie_id);
      const recommendations_movie_data = await getRecommendedMoviesData(
        responseData.recommendations
      );

      const movieCastData = await getMovieCastData(
        responseData.input_movie.movie_id
      );

      setCastData(movieCastData);
      setInputMovieData(movie_data);
      setRecommendedMovies(recommendations_movie_data);

      setLoading(false);
      setSentimentLoading(true);

      const input_movie_imdb_id = movie_data.imdb_id;
      const review_request = new FormData();
      review_request.append("movie_imdb_id", input_movie_imdb_id);
      const review_response = await recommender_api.post(
        "/movie_reviews_sentiment",
        review_request
      );

      let inputReviews = review_response.data;
      if (inputReviews) {
        if (inputReviews.length > 10) inputReviews = inputReviews.slice(0, 10);
        setReviews(inputReviews);
      }
    }
    setSentimentLoading(false);
    setLoading(false);
  };

  const handleClick = async () => {
    await movieHandler(text);
  };

  const handleCardClick = async (movie_name) => {
    setText(movie_name);
    await movieHandler(movie_name);
  };

  let finalComponent = null;

  let reviewsComponent = null;

  if (sentimentLoading) reviewsComponent = <ReviewLoading />;

  if (reviews != null && reviews.length !== 0)
    reviewsComponent = (
      <>
        <br />
        <ReviewsCard reviews={reviews} />
      </>
    );

  if (loading) finalComponent = <Loading />;
  else if (error) {
    finalComponent = <Error error={error} />;
  } else {
    finalComponent = recommendedMovies && (
      <>
        <br />
        <br />
        <div className="recommendation_section">
          <InputMovieCard {...inputMovieData} />
          <br />

          <center>
            <h1 className="title">About "{inputMovieData.title}" Cast</h1>
          </center>
          <br />

          <div className="cast_data_cards">
            {castData.map((cast) => {
              return (
                cast.profile_path && <MovieCastCard key={cast.id} {...cast} />
              );
            })}
          </div>

          {reviewsComponent && reviewsComponent}

          <br />
          <center>
            <h1 className="title">Recommended Movies Based On Your Search</h1>
          </center>
          <div className="recommendation_row">
            {recommendedMovies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={(e) => handleCardClick(movie.title)}
                >
                  <RowMovieCard key={movie.rank} {...movie} />
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="app">
      {/* Title */}
      <TitleCard />

      {/* Search */}
      <div className="app__search_container">
        <div className="search_wrapper">
          <input
            className="search_input"
            value={text}
            onChange={(e) => onChangeHandler(e.target.value)}
            onBlur={() => {
              setTimeout(() => {
                setSuggestions(null);
              }, 200);
            }}
            type="text"
            placeholder="Search For A Movie"
          />

          <Button
            className="search_button"
            variant="contained"
            color="primary"
            disabled={text === ""}
            startIcon={<SearchIcon />}
            onClick={() => handleClick()}
          >
            Search
          </Button>

          {suggestions && (
            <div className="suggestion_container">
              {suggestions.map((suggestion, i) => {
                return (
                  <div
                    className="suggestion"
                    onClick={() => onSuggestHandler(suggestion.title)}
                    key={i}
                  >
                    {suggestion.title}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Rated Movies or Movie and Recommendations */}

      {finalComponent}

      {/* About Application */}
      <br />
      <center>
        <h1 className="title about_title">About Application</h1>
      </center>
      <br />
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div className="about_application_content">
          Welcome to KVG Movie Zone. This is an AI based web application in
          which you can search for any Hollywood Movie. This application will
          provide all the information related to that movie, does sentiment
          analysis on the movie reviews and the most interesting part, this
          application will provide you the top 10 movie recommendations based on
          your search. Search for a movie for better experience.
        </div>
      </div>

      {/* About Me */}
      <br />
      <AboutMe />
    </div>
  );
}

export default App;
