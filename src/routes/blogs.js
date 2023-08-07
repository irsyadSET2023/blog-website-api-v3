import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import isAdmin from "../middleware/isAdmin";
import blogController from "../controllers/blogs/blog";

const blogRoutes = Router();

// ---------------------Blog------------------------------
//get all blog
blogRoutes.get("/", isAuthenticated, blogController.getAllBlog);

//get single blog
blogRoutes.get("/:id", isAuthenticated, blogController.getSingleBlog);
//add blog
blogRoutes.post("/", isAuthenticated, blogController.addBlog);
//update blog
blogRoutes.put("/", isAuthenticated, blogController.updateBlog);
//delete blog
blogRoutes.delete("/", isAuthenticated, blogController.deleteBlog);

export default blogRoutes;
