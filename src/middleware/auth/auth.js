import { body } from "express-validator";
import query from "../../database";

export const loginValidator = [
  body("identifier")
    .notEmpty()
    .withMessage("User Name must not be empty")
    .custom(async function (value) {
      const user = await query(
        "SELECT * FROM users WHERE username=$1 or email=$1",
        [value]
      );
      if (!user) {
        throw new Error("User Does Not Exist");
      }
    }),
];

export const registorValidator = [
  body("username")
    .notEmpty()
    .withMessage("User Name must not be empty")
    .isAlpha()
    .withMessage("Must Be Alphabet Only")
    .custom(async function (value) {
      const user = await query("SELECT * FROM users WHERE username=$1", [
        value,
      ]);

      console.log("user", user.rows.length);
      if (user.rows.length > 0) {
        throw new Error("This User Name Already Exist");
      }
    }),
  body("email")
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Must be email")
    .custom(async function (value) {
      const user = await query("SELECT * FROM users WHERE email=$1", [value]);
      if (user.rows.length > 0) {
        throw new Error("This Email Already Exist");
      }
    }),
  body("password").notEmpty().withMessage("Must not be Empty"),
];
