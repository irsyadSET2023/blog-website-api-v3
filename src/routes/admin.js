import adminPrivillege from "../controllers/auth/admin";
import isAuthenticated from "../middleware/isAuthenticated";
import isAdmin from "../middleware/isAdmin";
import { Router } from "express";

const adminRoutes = Router();
//admin delete user
adminRoutes.delete("/", isAuthenticated, isAdmin, adminPrivillege.deleteUser);
//admin undo delete
adminRoutes.post("/", isAuthenticated, isAdmin, adminPrivillege.undoDeleteUser);

export default adminRoutes;
