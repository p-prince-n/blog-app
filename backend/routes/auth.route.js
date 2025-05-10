import express from 'express';
import { signUp } from '../controller/auth.controller.js';
import { signIn } from '../controller/auth.controller.js';
import { google } from '../controller/auth.controller.js';

const authRoute=express.Router();

authRoute.post('/signUp', signUp);
authRoute.post('/signIn', signIn);
authRoute.post('/google', google);

export default authRoute;