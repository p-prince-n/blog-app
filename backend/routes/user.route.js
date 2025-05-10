import express from 'express';
import { test, updateUser, deleteUser, signOut, getUsers, getUserById } from '../controller/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const userRoute=express.Router();

userRoute.get('/text', test);
userRoute.put('/update/:userId', verifyUser, updateUser);
userRoute.delete('/delete/:userId', verifyUser, deleteUser);
userRoute.post('/signOut', signOut);
userRoute.get('/getUsers', verifyUser, getUsers);
userRoute.get('/:userId', getUserById );

export default userRoute;