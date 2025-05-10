import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const test=(req, res)=>{
    res.json({'text': 'hello'});
}

export const updateUser=async (req, res, next)=>{
    const findUser=await User.findById(req.params.userId);
    if(!findUser) return next(errorHandler(404, 'User not found.'));
    if(req.user.id!==req.params.userId) return next(errorHandler(403, 'you are not allowed to update this user.'));
    if(req.body.password){
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password should contain at least 6 characters.'));
        }
        req.body.password=await bcrypt.hash(req.body.password, 10);
    }
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length >20){
            return next(errorHandler(400, 'username must be between 7 and 20 characters.'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'username can not contains spaces.'));
        }
        if(req.body.username!==req.body.username.toLowerCase()){
            return next(errorHandler(400, 'username must be lower case.'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'username con only contains letters and numbers '));
        }
    }
    try{
        const updatedUser=await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePic: req.body.profilePic,
            },
        }, {new: true});
        const {password, ...rest}=updatedUser;
        res.status(200).json(rest._doc);

    }catch(e){
        next(errorHandler(500, e.message));
    }

}

export const deleteUser=async(req, res)=>{
    if( !req.user.isAdmin && req.user.id!==req.params.userId) return next(errorHandler(403, 'you are not allowed to delete this user.'));
    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted')

    }catch(e){
        next(errorHandler(500, e.message));
    }
}

export const signOut=(req, res, next)=>{
    try{
        res.clearCookie('access_token').status(200).json('User has been sign out.');

    }catch(e){
        next(errorHandler(500, e.message));
    }

}

export const getUsers=async(req, res, next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'you are not allowed to see all users.'));
    }
    try{
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit=parseInt(req.query.limit) || 9;
        const sortDir = req.query.sort === 'asc' ? 1 : -1;
        const users= await User.find().sort({createdAt: sortDir}).skip(startIndex).limit(limit);
      

        const usersWithoutPass=users.map((user)=>{
            const {password, ...rest}=user._doc;
            return rest;
        });
        const totalUsers= await User.countDocuments();
        const now =new Date();
        const oneMonthAgoDate=new Date(
            now.getFullYear(),
            now.getMonth() -1 ,
            now.getDate(),
        )
        const lastMonthsUser=await User.countDocuments({createdAt: {$gte: oneMonthAgoDate}});

        return res.status(200).json({users: usersWithoutPass, totalUsers, lastMonthsUser});

    }
    catch(e){
        next(errorHandler(500, e.message));
    }
}
export const getUserById=async(req, res, next)=>{
    try{
        const user=await User.findById(req.params.userId);
        if(!user) return next(errorHandler(404, 'User not found.'))
        const {password, ...rest}=user;
        res.status(200).json(rest._doc); 

    }catch(e){
        next(errorHandler(500, e.message));
    }
}