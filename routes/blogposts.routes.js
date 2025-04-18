import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import {
  createBlog,
  getMyBlogs,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
} from "../controllers/blogControllers.js";

const router = express.Router();

router.post("/", verifyUser, createBlog);
router.get("/mine", verifyUser, getMyBlogs);
router.get("/", getAllBlogs);
router.get("/:id", verifyUser, getSingleBlog);
router.patch("/:id", verifyUser, updateBlog);
router.delete("/:id", verifyUser, deleteBlog);

export default router;
