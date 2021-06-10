import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#121212",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    maxWidth: 1200,
    margin: "10px",
    backgroundColor: "#424242",
    boxShadow: "0 0 6px white",
  },
});

function ReviewsCard({ reviews }) {
  const classes = useStyles();

  return (
    <>
      <center>
        <h1 className="title">Reviews</h1>
      </center>
      <br />

      <TableContainer className="reviews_container" component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center">Reviews</StyledTableCell>
              <StyledTableCell align="center">Sentiment</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <StyledTableRow className="table__row" key={review.id}>
                <StyledTableCell className="table__row_content" align="center">
                  {review.id}.
                </StyledTableCell>
                <StyledTableCell className="table__row_content" align="left">
                  <div className="review_content_container">
                    {review.content}
                  </div>
                </StyledTableCell>
                <StyledTableCell className="table__row_content" align="right">
                  {review.sentiment}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ReviewsCard;
