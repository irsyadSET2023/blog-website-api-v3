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

const userAuthenthication = { registerUser, login, logout };
export default userAuthenthication;
