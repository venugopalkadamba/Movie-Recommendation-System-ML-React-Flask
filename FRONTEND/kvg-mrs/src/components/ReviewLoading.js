import React from "react";

function ReviewLoading() {
  return (
    <center>
      <br />
      <br />
      <img
        src={`${process.env.PUBLIC_URL}/assets/reviews_loading.gif`}
        alt="loading"
        width="350px"
        height="125px"
      />
    </center>
  );
}

export default ReviewLoading;
