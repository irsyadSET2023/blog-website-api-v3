import { Router } from "express";
import userController from "../controllers/root/users";
import userAuthenthication from "../controllers/auth/index";
import isAuthenticated from "../middleware/isAuthenticated";
import isAdmin from "../middleware/isAdmin";
import blogController from "../controllers/root/blog";
import commentsController from "../controllers/root/comment";
const apiRoutes = Router();
//login user
apiRoutes.post("/users/login", userAuthenthication.login);
//logout user
apiRoutes.get("users/logout", isAuthenticated, userAuthenthication.logout);

//get all user
apiRoutes.get("/users", isAuthenticated, isAdmin, userController.getAllUsers);
//add user
apiRoutes.post("/users", userAuthenthication.registerUser);
//get single user
apiRoutes.get(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  userController.getSingleUser
);
//get single user
apiRoutes.put("/users", isAuthenticated, userController.updateUser);
export default apiRoutes;

//get all blog
apiRoutes.get("/blogs", isAuthenticated, isAdmin, blogController.getAllBlog);

//get single blog
apiRoutes.get(
  "/blogs/:id",
  isAuthenticated,
  isAdmin,
  blogController.getSingleBlog
);

//add blog
apiRoutes.post("/blogs", isAuthenticated, blogController.addBlog);

//update blog
apiRoutes.put("/blogs", isAuthenticated, blogController.updateBlog);

//get all comments
apiRoutes.get(
  "/comments",
  isAuthenticated,
  isAdmin,
  commentsController.getAllComments
);

//post comments
apiRoutes.post("/comments", isAuthenticated, commentsController.postComments);
//edit comments
apiRoutes.put("/comments", isAuthenticated, commentsController.editComments);
// delete comments
apiRoutes.delete(
  "/comments",
  isAuthenticated,
  commentsController.deleteComments
);

//see session
apiRoutes.get("/session", function (req, res) {
  const session = req.sessionStore;
  console.log(session);
  res.status(200).json({ message: session });
});
