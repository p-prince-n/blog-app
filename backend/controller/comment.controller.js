import nodemon from "nodemon";
import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment=async(req, res, next)=>{
    try{
        const {content, postId, userId}= req.body;
        if(userId !== req.user.id){
            return next(errorHandler(500, 'you are not allowes to create this comment'));
        }
        const newComm= new Comment({
            content,
            postId,
            userId
        });
        await newComm.save();
        res.status(200).json(newComm);   

    }catch (e) {
        return next(errorHandler(500, e.message));
    }
}


export const getComments=async(req, res, next)=>{
    try{
        const comments= await Comment.find({postId: req.params.postId}).sort({createdAt: -1});
        res.status(201).json(comments);


    }catch (e) {
        return next(errorHandler(500, e.message));
    }
}

export const likeComments=async(req, res, next)=>{
    try{
        const comment= await Comment.findById(req.params.commentId);
        if(!comment) return next(errorHandler(404, 'Comment not found.'));
        const userIndex=comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.noOfLikes += 1;
            comment.likes.push(req.user.id)
        }else{
            comment.noOfLikes -= 1;
            comment.likes.splice(userIndex, 1)
        }
        await comment.save();
        console.log(comment)
        res.status(200).json(comment);

    }catch (e) {
        return next(errorHandler(500, e.message));
    }
}

export const editComments=async(req, res, next)=>{
    try{
        const comment= await Comment.findById(req.params.commentId);
        if(!comment) return next(errorHandler(404, 'Comment not found.'));
        if(comment.userId !== req.user.id && !req.user.isAdmin ){
            return next(errorHandler(500, 'you are not allowes to edit this comment'));
        }
        const editComment=await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content,
            },{new : true}
        );
        res.status(200).json(editComment)
    }catch (e) {
        return next(errorHandler(500, e.message));
    }
}

export const deleteComments=async(req, res, next)=>{
    try{
        const comment= await Comment.findById(req.params.commentId);
        if(!comment) return next(errorHandler(404, 'Comment not found.'));
        if(comment.userId !== req.user.id && !req.user.isAdmin ){
            return next(errorHandler(500, 'you are not allowes to delete this comment'));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('comment has been deleted.');

    }catch (e) {
        return next(errorHandler(500, e.message));
    }

}

export const getAllComments=async(req, res, next)=>{
    if(!req.user.isAdmin) return next(errorHandler(400, 'You are not allowed to get all comments'));
    try{
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit=parseInt(req.query.limit) || 9;
        const sortDir = req.query.sort === 'asc' ? 1 : -1; 
        const comments=await Comment.find().sort({createdAt : sortDir}).skip(startIndex).limit(limit)
        const totalComments= await Comment.countDocuments();
        const now=new Date();
        const oneMonthsAgo=new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthsComments= await Comment.countDocuments({createdAt : {$gte : oneMonthsAgo}});
        res.status(200).json({
            comments, totalComments, lastMonthsComments
        })


    }catch (e) {
        return next(errorHandler(500, e.message));
    }
}