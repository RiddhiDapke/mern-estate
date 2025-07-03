import User from '../models/user.model.js'; // Adjust the path as necessary
import bcrypt from 'bcryptjs';
import { errorHander } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async(req, res, next) => {

    const { username, email, password } = req.body;
    const hasheedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password : hasheedPassword });
    await newUser.save()
        .then(user => {
            res.status(201).json({ message: 'User created successfully', user });
        })
        // .catch(err => {
        //     next(errorHander(550, 'Error creating user'));
        // });
        .catch(err => {
            next(error);
        });


}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHander(404, 'User not found'));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHander(401, 'Wrong Credentials'));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, {httpOnly:true}) // 30 days expiration
        .status(200)
        .json(rest);
    }
    catch (error) {
        next(errorHander(550, 'Error signing in'));
    }
}