import bcrypt from 'bcryptjs';
import { errorHander } from '../utils/error.js';
import User from '../models/user.model.js'; // Adjust the path as necessary
 export const test = (req, res) => {
    res.status(200).json({ message: 'User route is working' });
}

export const updateUser = async (req, res, next) => {
    if(req.user.id != req.params.id) return next({ statusCode: 403, message: 'You can only update your own account' });
    try {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set:{
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,

        
        } } , { new: true });
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);   
    }
}