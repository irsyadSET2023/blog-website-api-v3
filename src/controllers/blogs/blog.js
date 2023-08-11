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
  // let id = req.params.id;
  const author_id = req.params.id;
  const data = await query(
    "SELECT * FROM posts WHERE author_id=$1 AND deleted_at IS  NULL",
    [author_id]
  );
  const blogs = data.rows;
  if (!blogs.length) {
    res.status(400).json({ message: "No Blogs Found" });
  } else {
    res.status(200).json({ blogs, message: `Blogs from author ${author_id}` });
  }
}

async function addBlog(req, res) {
  const userId = req.session.auth;
  const body = req.body;
  const dateTime = Math.floor(Date.now());
  const slug =
    Math.random().toString(36).substring(2, 8) + "_" + String(dateTime);
  const data = await query("SELECT * FROM posts WHERE title=$1", [body.title]);
  console.log(data.rows, "Rows");
  // if (data.rows.length > 0) {
  //   res.status(403).json({
  //     message: "One user cannot has more than 1 blog that has same title",
  //   });
  //   return;
  // }
  await query(
    "INSERT INTO posts (author_id,title,body,slug,image_url) VALUES ($1,$2,$3,$4,$5)",
    [userId, body.title, body.body, slug, body.image_url]
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
  const blogSlug = req.body.slug;

  console.log(typeof userId, " ", userId);

  const columns = [];
  const values = [];
  let paramIndex = 1;

  Object.entries(body).forEach(([key, value]) => {
    if (key === "id") return;

    if (key === "slug") return;

    if (key === "title") {
      columns.push(`title = $${paramIndex++}`);
      values.push(value);
    } else {
      columns.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });
  columns.push("updated_at = CURRENT_TIMESTAMP");

  const queryStr = `UPDATE posts SET ${columns.join(
    ","
  )} WHERE slug=$${paramIndex++} AND author_id=$${paramIndex++}`;

  values.push(blogSlug);
  values.push(userId);

  query(queryStr, values)
    .then(function (resDb) {
      res.status(200).json({ message: "A blog is updated" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

async function deleteBlog(req, res) {
  const userId = req.session.auth;
  const blogSlug = req.body.slug;
  console.log(blogSlug);
  await query(
    "UPDATE posts SET deleted_at=CURRENT_TIMESTAMP WHERE slug=$1 AND author_id=$2",
    [blogSlug, userId]
  )
    .then(function (resDb) {
      res.status(200).json({ message: "Your post is deleted" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

const blogController = {
  getAllBlog,
  getSingleBlog,
  addBlog,
  updateBlog,
  deleteBlog,
};
export default blogController;
