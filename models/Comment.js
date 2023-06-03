import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

export default mongoose.model('Comment', CommentSchema);