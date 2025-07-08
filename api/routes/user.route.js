import express from 'express';
import { test, updateUser , deleteUser} from '../controllers/user.controller.js'; // Adjust the path as necessary
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.delete('/delete/:id', verifyToken, deleteUser)
router.post('/update/:id',verifyToken, updateUser);



export default router;