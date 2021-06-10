import axios from "axios";

export default axios.create({
  baseURL: "https://kvgmrs-api.herokuapp.com/",
  // baseURL: "http://localhost:5000/",
  headers: { "Content-Type": "multipart/form-data" },
});
