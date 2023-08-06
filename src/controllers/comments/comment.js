import query from "../../database";

async function getAllComments(req, res) {
  const data = await query("SELECT * FROM comments");
  const comments = data.rows;
  res.status(200).json({ comments });
}

async function postComments(req, res) {
  const userId = req.session.auth;
  const body = req.body;
  const commentSlug =
    "comment_" +
    String(userId) +
    "_" +
    String(body.post_id) +
    "_" +
    String(Date.now());

  await query(
    "INSERT INTO comments (post_id,user_id,comment_user,comment_slug) VALUES ($1,$2,$3,$4)",
    [body.post_id, userId, body.comment, commentSlug]
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
  const commentSlug = req.body.comment_slug;

  await query(
    "UPDATE comments SET deleted_at=CURRENT_TIMESTAMP WHERE comment_slug=$1 AND user_id=$2",
    [commentSlug, userId]
  )
    .then(function (resDb) {
      res.status(200).json({ message: "A comment is deleted" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

async function editComments(req, res) {
  const commentSlug = req.body.comment_slug;
  const newComment = req.body.comment_user;
  const userId = req.session.auth;

  await query(
    "UPDATE comments SET comment_user=$1, updated_at=CURRENT_TIMESTAMP WHERE comment_slug=$2 and user_id=$3",
    [newComment, commentSlug, userId]
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
