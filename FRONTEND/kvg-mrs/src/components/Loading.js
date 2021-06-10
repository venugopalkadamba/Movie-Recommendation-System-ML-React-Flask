import React from "react";

function Loading() {
  return (
    <center>
      <br />
      <br />
      <img
        src={`${process.env.PUBLIC_URL}/assets/loading.gif`}
        alt="loading"
        width="125px"
        height="125px"
      />
    </center>
  );
}

export default Loading;
