import express from "express";
import { signup, login } from "../controllers/authControllers.js";
import validateLogDetails from "../middleware/validateLogDetails.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", validateLogDetails, login);

export default router;
