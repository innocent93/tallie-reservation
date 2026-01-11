import { Router } from "express";
import { register, login, me } from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);

export default router;
