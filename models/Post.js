import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    tags: {
      type: [String],
      default: []
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Post', PostSchema);
