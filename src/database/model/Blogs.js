import postgressConnection from "../connection";

const Blogs = postgressConnection.define("posts", {
  title: {},
});
