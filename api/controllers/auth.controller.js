import User from '../models/user.model.js'; // Adjust the path as necessary
import bcrypt from 'bcryptjs';
import { errorHander } from '../utils/error.js';

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