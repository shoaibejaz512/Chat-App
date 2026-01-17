import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectedRoute } from "../middlewear/auth.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.put("/update-profile",protectedRoute,updateProfile);
router.get("/check",protectedRoute,checkAuth);


export default router;