import { Router } from "express";
import { createBlogs } from "../controllers/blogControllers.js";

const router = Router();

router.route("/").post(createBlogs);

export default router;
