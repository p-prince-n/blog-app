import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPost, getPosts,  deletePost, updatePost } from '../controller/post.controller.js';

const postRoute=express.Router();

postRoute.post('/create', verifyUser, createPost);
postRoute.get('/getPosts',  getPosts)
postRoute.delete('/deletePost/:postId/:userId', verifyUser, deletePost)
postRoute.put('/updatePost/:postId/:userId', verifyUser, updatePost)

export default postRoute;