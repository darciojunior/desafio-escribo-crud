import { Router } from "express";
const router = Router();
import { login, register, getCurrentUser } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/getCurrentUser", authenticateUser, getCurrentUser);

export default router;
