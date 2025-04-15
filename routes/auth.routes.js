import {Router} from 'express';
import validateLogDetails from '../middleware/validateLogDetails.js';
import {signup, login } from '../controllers/authControllers.js'

const router = Router();

router.route("/auth/signup").post(signup);

router.route("/auth/login").post([validateLogDetails], login);

export default router;