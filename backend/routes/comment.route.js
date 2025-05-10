import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createComment, getComments, likeComments, editComments, deleteComments, getAllComments } from '../controller/comment.controller.js';

const commentRoute=express.Router();
commentRoute.post('/create', verifyUser, createComment)
commentRoute.get('/getComments/:postId',  getComments)
commentRoute.put('/likeComments/:commentId', verifyUser,  likeComments)
commentRoute.put('/editComments/:commentId', verifyUser,  editComments)
commentRoute.delete('/deleteComments/:commentId', verifyUser,  deleteComments)
commentRoute.get('/getComments', verifyUser, getAllComments)

export default commentRoute;