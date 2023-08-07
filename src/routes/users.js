import { Router } from "express";
import userController from "../controllers/users/users";
import userAuthenthication from "../controllers/auth/index";
import isAuthenticated from "../middleware/isAuthenticated";
const userRoutes = Router();

// ---------------------User------------------------------
//login user
userRoutes.post("/login", userAuthenthication.login);
//logout user
userRoutes.get("/logout", isAuthenticated, userAuthenthication.logout);
//delete user
userRoutes.delete("/", isAuthenticated, userAuthenthication.deactivateAccount);
//get all user
userRoutes.get("/", isAuthenticated, userController.getAllUsers);
//add user
userRoutes.post("/", userAuthenthication.registerUser);
//get single user
userRoutes.get("/:id", isAuthenticated, userController.getSingleUser);
//update single user
userRoutes.put("/", isAuthenticated, userController.updateUser);
export default userRoutes;
