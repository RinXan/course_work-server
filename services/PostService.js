import Post from '../models/Post.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

class PostService {
  async create({ userId, title, text, imageUrl, tags }) {
    try {
      const doc = new Post({
        title,
        text,
        imageUrl: imageUrl?.trim(),
        tags: tags.length ? tags.split(' ') : [],
        author: userId,
      });

      const post = await doc.save();

      await User.findByIdAndUpdate(userId, {
        $push: { posts: post },
      });

      return post;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(params) {
    try {
      let posts = [];
      let { author, user } = params;

      if (author) {
        posts = await Post.find({ author }).sort('-createdAt').populate('author').exec();
      } else if (user) {
        posts = await Post.find({ likes: { $in: user } })
          .sort('-createdAt')
          .populate('author')
          .exec();
      } else {
        posts = await Post.find().sort('-createdAt').populate('author').exec();
      }

      return posts;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getPop() {
    try {
      let posts = await Post.find().limit(10).sort('-createdAt').populate('author').exec();

      return posts;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getOne(postId) {
    try {
      const post = await Post.findById(postId).populate('author');
      if (!post) return false;
      post.views += 1;
      await post.save();
      return post;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async search(text, tag) {
    try {
      const title = new RegExp(text, 'i');
      const tagList = tag.split(',').map(tag => tag.toLowerCase());

      const posts = await Post.find({
        $or: [{ title }, { tags: { $in: tagList } }],
      }).populate('author');

      if (!posts.length) return false;

      return posts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id, title, text, tags, imageUrl) {
    try {
      const doc = await Post.findByIdAndUpdate(
        { _id: id },
        { title, text, imageUrl, tags: tags && tags.split(' ') },
        { new: true },
      );

      if (!doc) return false;

      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(postId, userId) {
    try {
      const post = await Post.findByIdAndDelete(postId);

      if (!post) return false;

      if (post.imageUrl) {
        const filePath = path.join('.', post.imageUrl);

        fs.unlink(filePath, (err) => {
          if (err) return res.json({ message: err.message });
        });
      }

      await User.findByIdAndUpdate(userId, {
        $pull: { posts: postId },
      });

      return post;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async like(postId, userId) {
    try {
      const post = await Post.findById(postId);

      if (!post) return false;

      const index = post.likes.indexOf(userId);
      let message = '';

      if (~index) {
        post.likes.splice(index, 1);
        message = `${post.title} | Удалено из понравившихся`;
      } else {
        post.likes.push(userId);
        message = `${post.title} | Добавлено в понравившиеся`;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { likes: post.likes },
        { new: true },
      ).populate('author');

      await updatedPost.save();

      return {updatedPost, message};
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new PostService();
