import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'; // Adjust the path as necessary
import authRouter from './routes/auth.route.js'; // Adjust the path as necessary
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() =>
    console.log('Connected to MongoDB')
)
.catch(err =>
    console.error('Error connecting to MongoDB:', err)
);

const app = express();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use(express.json()); // Middleware to parse JSON bodies, without this, req.body will be undefined
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((error, req, res, next) => {
    
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
