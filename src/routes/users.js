import { Router } from "express";
import userController from "../controllers/users/users";
import userAuthenthication from "../controllers/auth/index";
import isAuthenticated from "../middleware/isAuthenticated";
import { loginValidator, registorValidator } from "../middleware/auth/auth";
import { validate } from "../middleware/auth";
const userRoutes = Router();

// ---------------------User------------------------------
//add user
userRoutes.post(
  "/",
  registorValidator,
  validate,
  userAuthenthication.registerUser
);
//login user
userRoutes.post("/login", loginValidator, validate, userAuthenthication.login);
//logout user
userRoutes.get("/logout", isAuthenticated, userAuthenthication.logout);
//delete user
userRoutes.delete("/", isAuthenticated, userAuthenthication.deactivateAccount);
//get all user
userRoutes.get("/", isAuthenticated, userController.getAllUsers);
//get single user
userRoutes.get("/:id", isAuthenticated, userController.getSingleUser);
//update single user
userRoutes.put("/", isAuthenticated, userController.updateUser);
export default userRoutes;
