import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "250px",
    height: "500px",
    boxShadow: "0 0 8px gray",
    backgroundColor: "#424242",
  },
  root_wrapper: {
    width: "100%",
    margin: "10px 20px 10px 0",
  },
  card_content: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  image_cover: {
    height: "360px",
  },
});

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";

function RowMovieCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.root_wrapper}>
      <CardActionArea>
        <Card className={classes.root}>
          <CardMedia
            className={classes.image_cover}
            component="img"
            alt={props.title || props.original_title}
            height="200"
            image={`${BASE_IMAGE_URL}${props.poster_path}`}
            title={props.title || props.original_title}
          />
          <CardContent style={{ padding: "10px" }}>
            <Typography
              className="card_title"
              gutterBottom
              variant="h6"
              component="h6"
            >
              {props.title || props.original_title}
            </Typography>
            <Typography
              className={classes.card_content}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              <b>Rating:</b> {props.vote_average}/10 ({props.vote_count} votes)
            </Typography>
          </CardContent>
        </Card>
      </CardActionArea>
    </div>
  );
}

export default RowMovieCard;
