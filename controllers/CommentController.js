import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { validationResult } from 'express-validator';

// Создание комментария
export const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { text } = req.body;
    const { id } = req.params;
    const author = req.userId;

    let newComment = new Comment({ text, postId: id, author });

    await newComment.save();

    newComment = await Comment.find({ _id: newComment._id }).populate('author');

    await Post.findByIdAndUpdate(id, {
      $push: { comments: newComment[0]._id },
    });

    res.json({
      newComment: newComment[0],
      message: 'Комментарий добавлен.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка при добавлении комментария',
    });
  }
};

// Получение всех комментариев поста
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ postId: id })
      .sort('-createdAt')
      .populate('author')
      .exec();

    if (!comments) {
      return res.json({
        message: 'Комментарии отсутствуют.',
      });
    }
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка при получении комментариев.',
    });
  }
};

// Удаление комментария
export const removeComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(400).json({ message: 'Комментарий не существует.' });
    }

    await Post.findByIdAndUpdate(id, {
      $pull: { comments: commentId },
    });

    res.json({ comment, message: 'Комментарий удален.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Комментарий не удален.' });
  }
};

// Удаление всех комментариев поста
export const removeAllComments = async (req, res) => {
  try {
    const postId = req.params.id;
    await Comment.deleteMany({postId});
    res.json({message: `Комментарии статьи под идентификатором - ${postId} - удалены`});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error while deleting all comments' });
  }
};
