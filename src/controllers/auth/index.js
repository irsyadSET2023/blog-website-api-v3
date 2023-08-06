import query from "../../database";
import bcrypt from "bcryptjs";

async function registerUser(req, res) {
  //receive data from body
  const { email, username, password } = req.body;
  const isAdmin = req.body?.is_admin ? true : false;
  let saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  console.log("Hash:", hashedPassword);
  await query(
    "INSERT INTO users (email,username,password,is_admin) VALUES ($1,$2,$3,$4)",
    [email, username, hashedPassword, isAdmin]
  )
    .then(function (resDb) {
      res.status(200).json({ message: "A user created" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

async function login(req, res) {
  const { identifier, password } = req.body;
  const data = await query(
    "SELECT * FROM users WHERE username=$1 or email=$1",
    [identifier]
  );
  const [user] = data.rows;

  if (!user) {
    res.status(400).json({ message: "Incorrect Identifier" });
    return;
  }

  bcrypt.compare(password, user.password, (error, bcryptRes) => {
    if (bcryptRes) {
      req.session.auth = user.id;
      const serverRes = {
        message: "Login successful",
        data: user,
        session: req.session,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "Login Unsuccesful",
        error: "Invalid credential",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });
}

async function logout(req, res) {
  const session = req.session.destroy();
  console.log(session);
  res.status(200).json({ message: "Successfully logout" });
}

async function deactivateAccount(req, res) {
  const userId = req.session.auth;
  console.log("User Id:", userId);
  try {
    // Start a transaction
    await query("BEGIN");

    // UPDATE query to set the new salary in the "employees" table
    const deleteUsersQuery = `
      UPDATE users set deleted_at=CURRENT_TIMESTAMP WHERE id=$1
    `;

    const deleteUsersValues = [userId];
    console.log("Hellow");
    const deleteUsersResult = await query(deleteUsersQuery, deleteUsersValues);
    console.log(deleteUsersResult);
    deleteUsersResult;
    // INSERT query to add the salary change to the "salary_audit_log" table

    const deleteBlogQuery = `
    UPDATE posts set deleted_at=CURRENT_TIMESTAMP WHERE author_id=$1
    `;

    const deleteBlogValues = [userId];
    await query(deleteBlogQuery, deleteBlogValues);

    const deleteCommentQuery = `UPDATE comments set deleted_at=CURRENT_TIMESTAMP WHERE user_id=$1`;
    const deleteCommentValues = [userId];
    await query(deleteCommentQuery, deleteCommentValues);

    // Commit the transaction
    await query("COMMIT");
    // client.release();

    // Send a response with the updated employee information
    res.json({
      message: "Your Account is deleted",
      // data: deleteUsersResult.rows[0],
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await query("ROLLBACK");
    // client.release();
    res.status(500).json({ error: error });
  }
}

async function adminPrivillegeDelete(req, res) {
  let selected_user_id = req.body.id;
  let current_timestamp = "CURRENT_TIMESTAMP";
  deleteUser(res, selected_user_id, current_timestamp);
}

async function undoDelete(req, res) {
  let selected_user_id = req.body.id;
  let current_timestamp = "NULL";
  deleteUser(res, selected_user_id, current_timestamp);
}

async function deleteUser(res, userId, params) {
  try {
    // Start a transaction
    await query("BEGIN");

    // UPDATE query to set the new salary in the "employees" table
    const deleteUsersQuery = `
      UPDATE users set deleted_at=${params} WHERE id=$1
    `;

    const deleteUsersValues = [userId];
    // console.log("Hellow");
    const deleteUsersResult = await query(deleteUsersQuery, deleteUsersValues);
    console.log(deleteUsersResult);
    deleteUsersResult;
    // INSERT query to add the salary change to the "salary_audit_log" table

    const deleteBlogQuery = `
    UPDATE posts set deleted_at=${params} WHERE author_id=$1
    `;

    const deleteBlogValues = [userId];
    await query(deleteBlogQuery, deleteBlogValues);

    const deleteCommentQuery = `UPDATE comments set deleted_at=${params} WHERE user_id=$1`;
    const deleteCommentValues = [userId];
    await query(deleteCommentQuery, deleteCommentValues);

    // Commit the transaction
    await query("COMMIT");
    // client.release();

    // Send a response with the updated employee information
    res.json({
      message: `Account ${userId} is deleted`,
      // data: deleteUsersResult.rows[0],
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await query("ROLLBACK");
    // client.release();
    res.status(500).json({ error: error });
  }
}

const userAuthenthication = {
  registerUser,
  login,
  logout,
  deactivateAccount,
  adminPrivillegeDelete,
};
export default userAuthenthication;
