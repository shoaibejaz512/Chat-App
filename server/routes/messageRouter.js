import express from "express"
import { protectedRoute } from "../middlewear/auth.js";
import { getAllMessages, getUserForSidebar, markMessageAsSeen, sendMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/users",protectedRoute,getUserForSidebar);
router.get("/:id",protectedRoute,getAllMessages);
router.put("/mark/:id",protectedRoute,markMessageAsSeen);
router.post("/send/:id",protectedRoute,sendMessages);


export default router;