import session from "supertest-session";
import app from "../app";
import query from "../database";

describe("Test Blog Api", function () {
  const identifier = "irsyad";
  const password = "password";
  const title = "One Piece 23";
  const body = "Pirates King is the best";
  const image_url = "/ultraman.jpg";
  let authSession;

  beforeEach(async () => {
    authSession = session(app);
    await authSession.post("/users/login").send({ identifier, password });
    authSession.userId = 1;
  });

  afterAll(async function () {
    await query("DELETE FROM posts WHERE author_id=$1 AND title=$2", [
      authSession.userId,
      title,
    ]);
  });

  test("Create Blog", async () => {
    console.log(authSession, "Hello");
    const result = await authSession.post("/blogs").send({
      title,
      body,
      image_url,
    });
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("A blog is created");
  });

  test("Update Blog Body", async () => {
    const data = await query(
      "SELECT * FROM posts WHERE author_id=$1 AND title=$2",
      [authSession.userId, title]
    );
    const newBody = "new body";
    console.log("slug-new", data.rows[0].slug);
    const result = await authSession.put("/blogs").send({
      slug: data.rows[0].slug,
      body: newBody,
      image_url: image_url,
      title: title,
    });
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("A blog is updated");
  });

  test("Delete Blog", async () => {
    const data = await query(
      "SELECT * FROM posts WHERE author_id=$1 AND title=$2",
      [authSession.userId, title]
    );
    const result = await authSession
      .delete("/blogs")
      .send({ slug: data.rows[0].slug });
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Your post is deleted");
  });
});
