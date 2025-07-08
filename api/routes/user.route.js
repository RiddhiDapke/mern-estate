import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js'; // Adjust the path as necessary
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();
router.get('/test', test);
router.post('/update/:id',verifyToken, updateUser);



export default router;