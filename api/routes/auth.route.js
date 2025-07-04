import express from 'express';
import { signup } from '../controllers/auth.controller.js';
import { signin , google} from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google); // Uncomment if you have a Google auth function

export default router;