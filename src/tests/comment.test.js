import session from "supertest-session";
import app from "../app";
import query from "../database";

describe("Test Comment Api", function () {
  const identifier = "irsyad";
  const password = "password";
  const post_id = 1;
  let authSession;
  beforeEach(async () => {
    authSession = session(app);
    await authSession.post("/users/login").send({ identifier, password });
    authSession.userId = 1;
  });

  test("Post Comment", async () => {
    const result = await authSession
      .post("/comments")
      .send({ post_id: post_id, comment: "Senpai" });
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("A comment created");
  });

  test("Edit Comment", async () => {
    const data = await query(
      "SELECT * FROM comments WHERE post_id=$1 AND user_id=$2",
      [post_id, authSession.userId]
    );
    const result = await authSession.put("/comments").send({
      comment_slug: data.rows[0].comment_slug,
      comment_user: "Updated_Comment",
    });
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Comment Edited");
  });
});
