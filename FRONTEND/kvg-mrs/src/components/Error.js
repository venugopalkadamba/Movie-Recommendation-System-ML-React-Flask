import React from "react";
import { Alert } from "@material-ui/lab";

function Error(props) {
  return (
    <>
      <br />
      <br />
      <center>
        <Alert style={{ maxWidth: "500px" }} severity="error">
          <b>{props.error}</b>
        </Alert>
      </center>
    </>
  );
}

export default Error;
