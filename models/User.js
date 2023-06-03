import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: {
      type: Number,
      default: 0,
    },
    subscriptions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    imageUrl: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
