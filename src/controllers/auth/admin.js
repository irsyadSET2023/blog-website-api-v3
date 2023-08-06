import query from "../../database";

async function deleteUser(req, res) {
  let selected_user_id = req.body.id;
  let current_timestamp = "CURRENT_TIMESTAMP";
  let message = `Account ${selected_user_id} is deleted`;
  utilFunction(res, selected_user_id, current_timestamp, message);
}

async function undoDeleteUser(req, res) {
  let selected_user_id = req.body.id;
  let current_timestamp = "NULL";
  let message = `Restored Deleted Account ${selected_user_id}`;
  utilFunction(res, selected_user_id, current_timestamp, message);
}

async function utilFunction(res, userId, status, message) {
  try {
    // Start a transaction
    await query("BEGIN");

    // UPDATE query to set the new salary in the "employees" table
    const deleteUsersQuery = `
      UPDATE users set deleted_at=${status} WHERE id=$1
    `;

    const deleteUsersValues = [userId];
    // console.log("Hellow");
    const deleteUsersResult = await query(deleteUsersQuery, deleteUsersValues);
    console.log(deleteUsersResult);
    deleteUsersResult;
    // INSERT query to add the salary change to the "salary_audit_log" table

    const deleteBlogQuery = `
    UPDATE posts set deleted_at=${status} WHERE author_id=$1
    `;

    const deleteBlogValues = [userId];
    await query(deleteBlogQuery, deleteBlogValues);

    const deleteCommentQuery = `UPDATE comments set deleted_at=${status} WHERE user_id=$1`;
    const deleteCommentValues = [userId];
    await query(deleteCommentQuery, deleteCommentValues);

    // Commit the transaction
    await query("COMMIT");
    // client.release();

    // Send a response with the updated employee information
    res.json({
      message: message,
      // data: deleteUsersResult.rows[0],
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await query("ROLLBACK");
    // client.release();
    res.status(500).json({ error: error });
  }
}

const adminPrivillege = {
  deleteUser,
  undoDeleteUser,
};
export default adminPrivillege;
