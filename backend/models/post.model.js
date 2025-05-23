import mongoose from "mongoose";

const postSchema=mongoose.Schema({
    userId:{
        type : String,
        require: true
    },
    title: {
        type: String,
        require: true,
        unique: true
    },
    content: {
        type: String,
        require: true,

    },
    image: {
        type: String,
        default: 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg'
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug:{
        type: String,
        require: true,
        unique: true
    }

}, {timestamps: true});

const Post=mongoose.model('Post', postSchema);
export default Post;