<div align="center">

<h1>Movie Recomendation System with Sentiment Analysis</h1>
<img src="https://img.shields.io/badge/Python-3.7.3-brown" />
<img src="https://img.shields.io/badge/Frontend-ReactJS-orange" />
<img src="https://img.shields.io/badge/BackendAPI-Flask-yellow" />
<img src="https://img.shields.io/badge/OtherAPI-TMDB-red" />
<img src="https://img.shields.io/badge/Deployment-Heroku-blue" />
</div>

## About

<b>KVG Movie Zone</b> is an AI based web application in which you can search for any Hollywood Movie. This application will provide all the information related to that movie, does <b>sentiment analysis</b> on the movie reviews and the most interesting part, this application will provide you the top 10 <b>movie recommendations</b> based on your search.<br/>

<b>ReactJS</b> was used for frontend which was deployed using <b>firebase hosting</b> and a <b>Flask API</b> was deployed using <b>Docker</b> container on <b>Heroku</b> to serve the machine learning models to the Frontend.

This application uses <b>Content Based Movie Recommendation</b> to recommend movies to the user.<b>TMDB</b> API was used to retrieve all the information related to the movie and its cast. <b>Web Scraping</b> was done on <b>IMDB</b> website to get the reviews related to the searched movie. Sentiments analysis is done using a machine learning model trained on a sample of IMDB Dataset.<br/>

<b>Deployed Web Application Link: </b>https://kvg-movie-zone.web.app/ <br/>
<b>Deployed Flask API Link: </b>https://kvgmrs-api.herokuapp.com/

## Demo

<div align="center">
<img src="./readme_assets/demo.gif" alt="demo" />
</div>

## Architecture

<div align="center">
<img src="./readme_assets/architecture.png" alt="architecture" />
</div>

## How to generate TMDB API Key?

1. Login to you your tmdb account: https://www.themoviedb.org/ or create one if you dont have.
2. Then open https://www.themoviedb.org/settings/api link and create your api key by filing all the necessary information.
3. <b>IMPORTANT:</b> After generating the TMDB API KEY, replace "ENTER YOUR TMDB_API_KEY" with your generated key in the API and FRONTEND code.

## TMDB API End Points

1. BASE URL: https://api.themoviedb.org/3
2. FOR MOVIE DATA: https://api.themoviedb.org/3/movie/{tmdb_movie_id}?api_key={TMDB_API_KEY}
3. FOR MOVIE CAST DATA: https://api.themoviedb.org/3/movie/{tmdb_movie_id}/credits?api_key={TMDB_API_KEY}
   <b>NOTE: </b>Please do refer the documentation at the BASE URL for better understanding.

## Flask API end points

1. To get recommendations: https://kvgmrs-api.herokuapp.com/recommend_movie

```
Data to be sent in POST request:
{
    movie_name:"The Avengers",
    number_of_recommendations:"10"
}

Data Returned by the API in JSON format:
{
    input_movie:{
        movie_id:TMDB_MOVIE_ID
    },
    recommendations:[
        {
            rank:1,
            movie_id:TMDB_MOVIE_ID
        },
        {
            rank:2,
            movie_id:TMDB_MOVIE_ID
        },
        .
        .
        .
    ]
}
```

2. To get Movie Reviews with Sentiments: https://kvgmrs-api.herokuapp.com/movie_reviews_sentiment

```
Data to be sent in POST request:
{
    movie_imdb_id:"MOVIE_IMDB_ID"
}

Data Returned by the API in JSON format:
[
    {
        id: 1,
        content: "THE REVIEW",
        sentiment: "SENTIMENT FOR THE REVIEW"
    },
    {
        id: 2,
        content: "THE REVIEW",
        sentiment: "SENTIMENT FOR THE REVIEW"
    },
    .
    .
    .
    10
]
```

<b>NOTE: </b>The error messages are returned in the following format:

```
{
    error:"Content of ERROR Message"
}
```

## Steps to run the React Project

1. Clone or download the repository in your local machine.
2. Open command prompt in the following folder `FRONTEND/kvg-mrs`
3. Install all the npm packages

```
npm install
```

4. Since the Flask API is already deployed on Heroku no need to run the Flask API in your local machine to start the React frontend. You can start the react application using the following command:

```
npm start
```

## Steps to run the Flask API

1. Clone or download the repository and open command prompt in `API` folder.
2. Create a virtual environemt

```
mkvirtualenv environment_name
```

3. Install all the dependencies

```
pip install -r requirements.txt
```

4. Run the app.py file

```
python app.py
```

The API will be running at http://127.0.0.1:5000/

<b>NOTE: </b>You can run the Flask API and the React Frontend in parallel and can use for development by replacing the baseURL,present in `FRONTEND/kvg-mrs/src/api/recommenderapi.js`, with the Flask API running link.

## Steps to Dockerize and Deploy the Flask API on Heroku

1. Clone or download the repository and open command prompt in `API` folder.
2. Create your docker account at https://hub.docker.com
3. Download the docker desktop based on you windows version from the official website of Dockers and login to the docker desktop.
4. Start the Docker desktop in you machine.
5. The Dockerfile for dockerinzing this Flask API is already present in the API folder.
6. Open command prompt in API folder and run the below mentioned commands:
7. Building the Image:

```
docker build -t ENTER_YOUR_OWN_TAG_NAME .
```

It will take some time for the execution of the above command. After execution of the above command you can see the docker image details using the following command:

```
docker images
```

8. Install Heroku CLI in your local machine.
9. Login to your account using follwing command:

```
heroku login
```

10. Run the following commands for deplyment. Logging into heroku container:

```
heroku container:login
```

11. Create a app in heroku:

```
heroku create YOUR_APP_NAME
```

11. Pushing the docker image into heroku:

```
heroku container:push web --app YOUR_APP_NAME
```

12. Releasing the web app:

```
heroku container:release web --app YOUR_APP_NAME
```

That's it, you can see your API running at `https://YOUR_APP_NAME.herokuapp.com/`

## Steps to Dockerize and run the Flask API in local machine

1. Clone or download the repository and open command prompt in `API` folder.
2. Create your docker account at https://hub.docker.com
3. Download the docker desktop based on you windows version from the official website of Dockers and login to the docker desktop.
4. Start the Docker desktop in you machine.
5. Replace the code present in Dockerfile with the code present in localhost_docker_code.txt.
6. Open command prompt in API folder and run the below mentioned commands:
7. Building the Image:

```
docker build -t ENTER_YOUR_OWN_TAG_NAME .
```

8. Run the docker container:

```
docker run -d -p 5000:5000 PREVIOUSLY_ENTERED_TAG_NAME
```

After execution of the above command you can notice the Flask API running at http://localhost:5000

## Tech Stack Used

<div align="center">

<table>
    <tr>
        <td><img src="./readme_assets/react.png" width="200px" height="200px" /></td>
        <td><img src="./readme_assets/firebase.png" width="200px" height="200px" /></td>
        <td><img src="./readme_assets/docker.png" width="200px" height="200px" /></td>
    </tr>
    <tr>
        <td><img src="./readme_assets/flask.png" width="200px" height="200px" /></td>
        <td><img src="./readme_assets/gunicorn.png" width="200px" height="200px" /></td>
        <td><img src="./readme_assets/heroku.jpg" width="200px" height="200px" /></td>
    </tr>
</table>

</div>

## Referred Article Links

For Movie Recommendation System

1. [Article 1](https://towardsdatascience.com/how-to-build-from-scratch-a-content-based-movie-recommender-with-natural-language-processing-25ad400eb243)
2. [Article 2](https://analyticsindiamag.com/how-to-build-a-content-based-movie-recommendation-system-in-python/)

For Deployment Using Dockers

1. [Article 1](https://medium.com/analytics-vidhya/dockerize-your-python-flask-application-and-deploy-it-onto-heroku-650b7a605cc9)
2. [Article 2](https://pythonise.com/series/learning-flask/building-a-flask-app-with-docker-compose)
3. [Article 3](https://betterprogramming.pub/create-a-running-docker-container-with-gunicorn-and-flask-dcd98fddb8e0)
4. [Article 4](https://itnext.io/setup-flask-project-using-docker-and-gunicorn-4dcaaa829620)
5. [Article 5](https://philchen.com/2019/07/09/a-scalable-flask-application-using-gunicorn-on-ubuntu-18-04-in-docker)

## Dataset Links

1. [IMDB 5000 Dataset](https://www.kaggle.com/carolzhangdc/imdb-5000-movie-dataset)
2. movies_metadata.csv and credits.csv from [Movies Dataset](https://www.kaggle.com/rounakbanik/the-movies-dataset)
3. Remaining Datasets are generated using `MovieRecommendationDatasetPreparation.ipynb` in `MovieRecommendationCodes folder`
4. [IMDB 50k Movie Reviews Dataset](https://www.kaggle.com/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews)

<div align="center">
<b>Please do ⭐ this repo if you liked my work</b>
</div>
