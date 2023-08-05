import query from "../../database";

async function getAllBlog(req, res) {
  const data = await query("SELECT * FROM posts");
  const blogs = data.rows;
  res.status(200).json({ blogs });
  if (!blogs.length) {
    res.status(400).json({ message: "No Blogs Found" });
  }
}

async function getSingleBlog(req, res) {
  let id = req.params.id;
  const data = await query("SELECT * FROM posts WHERE id=$1", [id]);
  const blogs = data.rows;
  if (!blogs.length) {
    res.status(400).json({ message: "No Blogs Found" });
  } else {
    res.status(200).json({ blogs });
  }
}

async function addBlog(req, res) {
  const userId = req.session.auth;
  const body = req.body;
  const slug = body.title.replaceAll(" ", "-").toLowerCase();
  await query(
    "INSERT INTO posts (author_id,title,body,slug) VALUES ($1,$2,$3,$4)",
    [userId, body.title, body.body, slug]
  )
    .then(function (resDb) {
      res.status(200).json({ message: "A blog is created" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

async function updateBlog(req, res) {
  const userId = req.session.auth;
  const body = req.body;
  const blogId = req.body.id;

  const columns = [];
  const values = [];
  let paramIndex = 1;

  Object.entries(body).forEach(([key, value]) => {
    if (key === "id") {
      return;
    }

    if (key === "title") {
      columns.push(`title = $${paramIndex++}`);
      values.push(value);
      columns.push(`slug = $${paramIndex++}`);
      const slug = value.replaceAll(" ", "-").toLowerCase();
      values.push(slug);
    } else {
      columns.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });
  columns.push("updated_at = CURRENT_TIMESTAMP");

  const queryStr = `UPDATE posts SET ${columns.join(
    ","
  )} WHERE id=$${paramIndex++} AND author_id=$${paramIndex++}`;

  values.push(blogId);
  values.push(userId);

  query(queryStr, values)
    .then(function (resDb) {
      res.status(200).json({ message: "A blog is updated" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

const blogController = { getAllBlog, getSingleBlog, addBlog, updateBlog };
export default blogController;
