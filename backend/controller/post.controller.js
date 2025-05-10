import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to create a post.'));
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return next(errorHandler(400, 'Title and content are required.'));
        }

        const existingPost = await Post.findOne({ title });
        if (existingPost) {
            return next(errorHandler(400, 'Title must be unique.'));
        }

        const slug = title.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');

        const newPost = await Post.create({
            ...req.body,
            slug,
            userId: req.user.id
        });

        return res.status(201).json(newPost);
    } catch (e) {
        return next(errorHandler(500, e.message));
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDir = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            }),

        }).sort({ updatedAt: sortDir }).skip(startIndex).limit(limit);
        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthsAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()

        );

        const lastMonthsPost = await Post.countDocuments({
            createdAt: { $gte: oneMonthsAgo },
        })
        res.status(200).json({ posts, totalPosts, lastMonthsPost });

    } catch (e) {
        return next(errorHandler(500, e.message));
    }
}
export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'you are not allowed to delete this post'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('This post has been deleted.')

    } catch (e) {
        return next(errorHandler(500, e.message));
    }

}


export const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'you are not allowed to update this post'));
    }
    try {
        const updatePost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
            }
        }, {new:  true})
        res.status(200).json(updatePost);

    } catch (e) {
        return next(errorHandler(500, e.message));
    }

}
