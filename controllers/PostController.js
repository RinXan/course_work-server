import User from '../models/User.js';
import { validationResult } from 'express-validator';
import PostService from '../services/PostService.js';

// Создание поста
export const create = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const errors = validationResult(req);

    if (!user) {
      throw new Error('Пользователь не найден.');
    }

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const data = {
      userId: req.userId,
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
    };

    const post = await PostService.create(data);

    res.json({
      post,
      message: 'Статья создана успешно.',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Ошибка при создании статьи',
    });
  }
};

// Получение всех постов
export const getAll = async (req, res) => {
  try {
    const authorId = req.params?.authorId;

    const posts = await PostService.getAll({ author: authorId });

    if (!posts) {
      return res.json({
        message: 'Постов нет',
      });
    }

    res.json({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка при получении постов',
    });
  }
};

// Получение трендовых постов
export const getPopular = async (req, res) => {
  try {
    const posts = await PostService.getPop();
    let result = [];

    if (!posts) {
      return res.json({
        message: 'Постов нет',
      });
    }

    for (let post of posts) {
      result.push({
        url: post._id.toString(),
        title: post.title,
        text: post.text,
        createdAt: post.createdAt,
        views: post.views,
        imageUrl: post.imageUrl,
        author: { id: post.author._id, fullname: post.author.fullname },
      });
    }

    result.sort((a, b) => b.views - a.views);

    res.json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка при получении постов',
    });
  }
};

// Получение всех понравившихся постов
export const getLiked = async (req, res) => {
  try {
    const posts = await PostService.getAll({ user: req.userId });

    if (!posts) {
      return res.json({
        message: 'Постов нет',
      });
    }

    const likedPosts = [];

    for (let post of posts) {
      const {
        _id,
        title,
        imageUrl,
        author: { fullname: authorName, _id: authorId },
        createdAt,
        views,
      } = post;
      likedPosts.push({ _id, title, imageUrl, authorName, authorId, createdAt, views });
    }

    res.json({ likedPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка при получении постов',
    });
  }
};

// Получения одного поста
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({ message: 'ID не получен.' });
    }

    const post = await PostService.getOne(postId);

    if (!post) {
      return res.json({ message: 'Статья не существует' });
    }

    res.json({ post });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: 'Ошибка при получении статьи',
    });
  }
};

// Получения постов по поисковому запросу
export const getPostsBySearch = async (req, res) => {
  try {
    const { text, tag } = req.query;

    const posts = await PostService.search(text, tag);

    if (!posts) {
      return res.json({ message: 'Статьи не найдены' });
    }

    res.json({ posts });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Ошибка при поиске статей в базе',
    });
  }
};

// Обновление поста
export const update = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { id } = req.params;
    const { title, text, tags, imageUrl } = req.body;

    const doc = await PostService.update(id, title, text, tags, imageUrl);

    if (!doc) {
      console.log(err);
      return res.json({
        message: 'Статья не обновлена.',
      });
    }

    res.json({
      post: doc,
      message: 'Статья обновлена успешно.',
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: 'Ошибка при обновлении статьи.',
    });
  }
};

// Удаление поста
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await PostService.remove(postId, userId);

    if (!post) {
      return res.status(400).json({ message: 'Статья не существует.' });
    }

    res.json({ postId, message: 'Статья удалена.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Статья не удалена.' });
  }
};

// like Or Unlike
export const likeUnlike = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    const { updatedPost, message } = await PostService.like(id, userId);

    if (!updatedPost) return res.status(404).json({ message: 'Пост не найден' });

    res.json({ post: updatedPost, message });
  } catch (error) {
    console.log(error);
  }
};
