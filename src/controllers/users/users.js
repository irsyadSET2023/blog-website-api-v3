import query from "../../database";
import bcrypt from "bcryptjs";

async function getAllUsers(req, res) {
  const data = await query("SELECT * FROM users");
  const users = data.rows;
  res.status(200).json({ users });
}

async function getSingleUser(req, res) {
  const id = req.params.id;
  console.log(id);
  const data = await query("SELECT * FROM users WHERE id=$1", [id]);
  const users = data.rows;
  console.log(users);
  res.status(200).json({ users });
}

async function updateUser(req, res) {
  const userId = req.session.auth;
  const body = req.body;

  const columns = [];
  const values = [];
  let paramIndex = 1;

  // Construct the SET clause for the SQL query
  Object.entries(body).forEach(([key, value]) => {
    columns.push(`${key} = $${paramIndex}`);
    if (key === "password") {
      let saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(value, saltRounds);
      console.log(hashedPassword);
      values.push(hashedPassword);
    } else {
      values.push(value);
    }
    paramIndex++;
  });

  columns.push("updated_at = CURRENT_TIMESTAMP");
  console.log(paramIndex);
  const queryStr = `UPDATE users SET ${columns.join(
    ", "
  )} WHERE id = $${paramIndex}`;
  values.push(userId);
  const data = query(queryStr, values);
  res.status(200).json({ message: "hello world", data });
}

const userController = { getAllUsers, getSingleUser, updateUser };
export default userController;
