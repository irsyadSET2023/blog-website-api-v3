import supertest from "supertest";
import app from "../app";
import session from "supertest-session";
import query from "../database";

describe("test authentication controller", function () {
  // beforeAll(async function () {
  //   await dbInit();
  // });

  afterAll(async function () {
    await query("DELETE FROM users WHERE username=$1", ["adnan"]);
  });
  test("Login with the correct identifier and password", async function () {
    const result = await supertest(app)
      .post("/users/login")
      .send({ identifier: "irsyad", password: "password" });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("Login successful");
  });

  test("Login with Empty identifier and password", async function () {
    const result = await supertest(app)
      .post("/users/login")
      .send({ identifier: "", password: "" });
    expect(result.statusCode).toEqual(403);
    // expect(result.body.err.errors[0].msg).toBe("User Does Not Exist");
  });

  test("Register User with incorrect username that has number", async function () {
    const result = await supertest(app).post("/users").send({
      username: "adnan1243",
      password: "adnan1234",
      email: "adnan@gmail.com",
    });
    expect(result.statusCode).toEqual(403);
    // expect(result.body.err.errors[0].msg).toBe("Must Be Alphabet Only");
  });

  test("Register User with incorrect email", async function () {
    const result = await supertest(app).post("/users").send({
      username: "adnan",
      password: "adnan1234",
      email: "adnan@gmail",
    });
    expect(result.statusCode).toEqual(403);
    // expect(result.body.err.errors[0].msg).toBe("Must be email");
  });

  test("Register User with correct parameter", async function () {
    const result = await supertest(app).post("/users").send({
      username: "adnan",
      password: "adnan1234",
      email: "adnan@gmail.com",
    });
    expect(result.statusCode).toEqual(200);
    // expect(result.body.message).toBe("Register");
  });
});

describe("test login logout", function () {
  const identifier = "irsyad";
  const password = "password";
  let authSession;

  beforeEach(() => {
    authSession = session(app); // Use request.agent to maintain cookies
  });

  test("return 200 with message 'Protected Route' and user data, Check Logout", async () => {
    const loginResponse = await authSession
      .post("/users/login")
      .send({ identifier, password });
    expect(loginResponse.status).toBe(200);

    const logoutResponse = await authSession.get("/users/logout");
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe("Successfully logout");
  });
});
