import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import commentsController from "../controllers/comments/comment";

const commentsRoutes = Router();

// ---------------------Comments------------------------------

//get all comments
commentsRoutes.get("/", isAuthenticated, commentsController.getAllComments);
//post comments
commentsRoutes.post("/", isAuthenticated, commentsController.postComments);
//edit comments
commentsRoutes.put("/", isAuthenticated, commentsController.editComments);
// delete comments
commentsRoutes.delete("/", isAuthenticated, commentsController.deleteComments);

export default commentsRoutes;
