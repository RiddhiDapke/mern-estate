import bcrypt from 'bcryptjs';
import { errorHander } from '../utils/error.js';
import User from '../models/user.model.js'; // Adjust the path as necessary
import Listing from '../models/listing.model.js';
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

export const deleteUser = async (req, res, next) => {
    if(req.user.id != req.params.id) return next({ statusCode: 401, message: 'You can only delete your own account' });
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token'); // Clear the cookie after deletion
        res.status(200).json({ message: 'User deleted successfully' }); // Clear the cookie after deletion
        
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if(req.user.id ==req.params.id){
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    }else{
        return next(errorHandler(401, 'You can only view your own listings'));
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return next({ statusCode: 404, message: 'User not found' });
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
    
}