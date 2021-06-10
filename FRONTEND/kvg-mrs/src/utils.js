import tmdbapi from "./api/tmdbapi";

const TMDB_API_KEY = "ENTER YOUR TMDB_API_KEY";

export const getMovieCastData = async (movie_id) => {
  const response = await tmdbapi.get(
    `/movie/${movie_id}/credits?api_key=${TMDB_API_KEY}`
  );

  let castData = response.data.cast;
  if (castData.length > 8) castData = castData.slice(0, 8);
  return castData;
};

export const getMovieVideoId = async (movie_id) => {
  const videoResponse = await tmdbapi.get(
    `/movie/${movie_id}/videos?api_key=${TMDB_API_KEY}`
  );
  const videos = videoResponse.data.results;
  if (videos.length > 0)
    return { name: videos[0].type, videoId: videos[0].key };
  else return null;
};

export const getMovieData = async (movie_id) => {
  const response = await tmdbapi.get(
    `/movie/${movie_id}?api_key=${TMDB_API_KEY}`
  );

  return response.data;
};

export const getRecommendedMoviesData = async (recommendations) => {
  let recommendationsData = [];
  let result = null;
  for (let recommended_movie of recommendations) {
    result = await getMovieData(recommended_movie.movie_id);
    recommendationsData.push(result);
  }
  return recommendationsData;
};
