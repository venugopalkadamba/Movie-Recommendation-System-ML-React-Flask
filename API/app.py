import os
import re
import json
import nltk
import difflib
import urllib
import pickle
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup

from flask import Flask, app, request
from flask_cors import CORS, cross_origin

from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from tmdbv3api import TMDb
from tmdbv3api import Movie
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


nltk.download("stopwords")
nltk.download("wordnet")
nltk.download("punkt")


app = Flask(__name__)

cors = CORS(app)


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add(
        "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"
    )
    response.headers.add("Access-Control-Allow-Methods",
                         "GET,PUT,POST,DELETE,OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response


def convert(o):
    if isinstance(o, np.generic):
        return o.item()
    raise TypeError


# MOVIE RECOMMENDATION MODEL
data = pd.read_csv("./api_utils/movie_recommendation/final_data.csv")
count_vectorizer = CountVectorizer()
count_matrix = count_vectorizer.fit_transform(data["movie_feature"])
similarity_matrix = cosine_similarity(count_matrix)
tmdb = TMDb()
TMDB_API_KEY = "ENTER YOUR TMDB_API_KEY"
tmdb.api_key = TMDB_API_KEY

CLASSIFIER_PATH = "./api_utils/movie_recommendation/sentiment_classifier.pkl"
TF_IDF_PATH = "./api_utils/movie_recommendation/tf_idf.pkl"

sentiment_classifier = pickle.load(open(CLASSIFIER_PATH, "rb"))
tf_idf = pickle.load(open(TF_IDF_PATH, "rb"))


lemmatizer = WordNetLemmatizer()


def preprocess_review(review):
    soup = BeautifulSoup(review, "html.parser")
    review = soup.get_text()
    review = re.sub("\[[^]]*\]", " ", review)
    review = re.sub("[^a-zA-Z]", " ", review)
    review = review.lower()
    review = nltk.word_tokenize(review)
    review = [
        word.strip() for word in review if word not in set(stopwords.words("english"))
    ]
    review = [lemmatizer.lemmatize(word) for word in review]
    return " ".join(review)


def movie_search_engine(movie_name, TMDB_API_KEY=TMDB_API_KEY):
    tmdb_movie = Movie()
    search_result = tmdb_movie.search(movie_name.strip())
    movie_id = search_result[0]["id"]
    movie_data = {}
    movie_data["movie_id"] = movie_id
    return movie_data


def get_movie_reviews_with_sentiment(movie_imdb_id):
    sauce = urllib.request.urlopen(
        "https://www.imdb.com/title/{}/reviews?ref_=tt_ov_rt".format(
            movie_imdb_id
        )
    ).read()
    soup = BeautifulSoup(sauce, "lxml")
    soup_result = soup.find_all(
        "div", {"class": "text show-more__control"})
    movie_reviews = []
    processed_reviews = []
    count = 0

    for reviews in soup_result:
        review = reviews.text
        if review is not None:
            movie_reviews.append(review)
            processed_reviews.append(preprocess_review(review))
            if count == 10:
                break
            count += 1

    processed_reviews = tf_idf.transform(processed_reviews)
    predictions = sentiment_classifier.predict(processed_reviews)
    labels = ["BAD", "GOOD"]

    all_reviews_data = []
    index = 1
    for review, sentiment in zip(movie_reviews, predictions):
        all_reviews_data.append(
            {
                "id": index,
                "content": review,
                "sentiment": labels[sentiment]
            }
        )
        index += 1
    return all_reviews_data


def movie_recommender_engine(movie_name, n_top_recommendations=10):
    movie_name = movie_name.strip().lower()
    if movie_name not in data["movie_title"].unique():
        temp = difflib.get_close_matches(
            movie_name, list(data.movie_title.unique()))
        if temp != []:
            word_similarity = get_word_similarity(movie_name, temp[0])
            if word_similarity > 75:
                movie_name = temp[0]
            else:
                return json.dumps(
                    {
                        "error": "Sorry! Movie is not in our database. Please check the spelling or try with another movie name"
                    },
                    default=convert,
                )
        else:
            return json.dumps(
                {
                    "error": "Sorry! Movie is not in our database. Please check the spelling or try with another movie name"
                },
                default=convert,
            )
    index = data.loc[data["movie_title"] == movie_name].index[0]
    matrix = list(enumerate(similarity_matrix[index]))
    matrix = sorted(matrix, key=lambda x: x[1], reverse=True)
    recommended_indexes = [
        index for (index, similarity) in matrix[0: n_top_recommendations + 5]
    ]
    recommended_movies = {"recommendations": []}
    rank = 1
    r_count = 1
    i = 0
    while i < len(recommended_indexes) and r_count <= n_top_recommendations:
        index = recommended_indexes[i]
        r_movie_name = data["movie_title"][index]
        try:
            movie_data = movie_search_engine(r_movie_name)
            if movie_name == r_movie_name:
                recommended_movies["input_movie"] = movie_data
            else:
                movie_data["rank"] = rank
                recommended_movies["recommendations"].append(movie_data)
                rank += 1
                r_count += 1
        except:
            pass
        i += 1

    recommended_movies = json.dumps(recommended_movies, default=convert)
    return recommended_movies


@app.route("/recommend_movie", methods=["POST", "GET"])
def recommend_movie():
    if request.method == "POST":
        try:
            form_values = request.form.to_dict()
            movie_name = str(form_values["movie_name"]).strip().lower()
            n_recommendation = int(
                str(form_values["number_of_recommendations"]))
            return movie_recommender_engine(movie_name, n_recommendation)
        except:
            return json.dumps({"error": "Invalid Data"}, default=convert)
    else:
        return json.dumps({"error": "No POST Data"}, default=convert)


@app.route("/movie_reviews_sentiment", methods=["POST", "GET"])
def movie_reviews_sentiment():
    if request.method == "POST":
        try:
            form_values = request.form.to_dict()
            movie_imdb_id = str(form_values["movie_imdb_id"])
            reviews_data = get_movie_reviews_with_sentiment(movie_imdb_id)
            return json.dumps(reviews_data, default=convert)
        except:
            return json.dumps({"error": "Invalid IMDB Id"}, default=convert)
    else:
        return json.dumps({"error": "No POST Data"}, default=convert)


@app.route("/", methods=["POST", "GET"])
def home():
    return json.dumps({"result": "This is Movie Recommender API"}, default=convert)


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
