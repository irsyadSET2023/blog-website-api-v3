import { async } from "regenerator-runtime";
import query from "../../database";

async function getAllComments(req, res) {
  const data = await query("SELECT * FROM comments");
  const comments = data.rows;
  res.status(200).json({ comments });
}

async function postComments(req, res) {
  const userId = req.session.auth;
  const body = req.body;

  await query(
    "INSERT INTO comments (post_id,user_id,comment_user) VALUES ($1,$2,$3)",
    [body.post_id, userId, body.comment]
  )
    .then(function (resDb) {
      res.status(200).json({ message: "A comment created" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

async function deleteComments(req, res) {
  const userId = req.session.auth;
  // const body = req.body;
  const commentId = req.body.id;

  await query("DELETE FROM comments WHERE user_id=$1 and id=$2", [
    userId,
    commentId,
  ])
    .then(function (resDb) {
      res.status(200).json({ message: "A comment is deleted" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

async function editComments(req, res) {
  const userId = req.session.auth;
  const blogId = req.body.post_id;
  const newComment = req.body.comment_user;

  await query(
    "UPDATE comments SET comment_user=$1 WHERE post_id=$2 AND user_id=$3",
    [newComment, blogId, userId]
  )
    .then(function (resDb) {
      res.status(200).json({ message: "Comment Edited" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

const commentsController = {
  getAllComments,
  postComments,
  editComments,
  deleteComments,
};
export default commentsController;
