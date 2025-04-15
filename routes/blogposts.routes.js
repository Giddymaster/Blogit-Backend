import { Router } from "express";
import  {createBlogs} from '../controllers/blogpostControllers.js';

const router = Router();

router.route("/").post(createBlogs);

export default router;