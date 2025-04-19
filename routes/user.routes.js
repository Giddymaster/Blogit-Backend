
import express from "express";
import { updateProfile } from "../controllers/userController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.put("/profile", verifyUser, updateProfile);

export default router;
