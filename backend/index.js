import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './lib/db.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRoute from './routes/post.route.js';
import commentRoute from './routes/comment.route.js';
import cors from 'cors'





dotenv.config();
const app=express();


app.use(cors({
  origin: 'https://deft-unicorn-703bee.netlify.app',
  credentials: true, 
}));
app.use(express.json({limit: '2mb'}));
app.use(cookieParser());    
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoute)



const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`sever running on : http://localhost:${PORT}`);
    connectDB();
})

app.use((err, req, res, next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || 'Internal Server error';
    res.status(statusCode).json({success: false, statusCode, message,});
});