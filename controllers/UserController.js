import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const email = req.body.email;
    const reqPassword = req.body.password;
    const isFreeEmail = await User.findOne({ email });

    if (isFreeEmail) {
      return res.json({
        message: 'Пользователь с таким email уже существует',
      });
    }

    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(reqPassword, salt);

    const doc = new User({
      fullname: req.body.fullname,
      email,
      imageUrl: req.body.imageUrl,
      password: passwordHash,
    });

    const newUser = await doc.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '14d',
      },
    );

    const { password, ...user } = newUser._doc;

    res.json({
      user,
      token,
      message: 'Пользователь успешно создан.',
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: 'Не удалось зарегистрироваться.',
      error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const email = req.body.email;

    const userInfo = await User.findOne({ email });

    if (!userInfo) {
      return res.json({
        message: 'Пользователь не существует.',
      });
    }

    const isCorrectPassword = await bcrypt.compare(req.body.password, userInfo.password);

    if (!isCorrectPassword) {
      return res.json({
        message: 'Неправильный пароль',
      });
    }

    const token = jwt.sign(
      {
        id: userInfo._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '14d',
      },
    );

    const { password, ...user } = userInfo._doc;

    res.json({
      user,
      token,
      message: 'Авторизация прошла успешно.',
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: 'Не удалось авторизоваться.',
    });
  }
};

export const getme = async (req, res) => {
  try {
    const userInfo = await User.findById(req.userId);

    if (!userInfo) {
      return res.json({
        message: 'Такого пользователя не существует.',
      });
    }

    const token = jwt.sign(
      {
        id: userInfo._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '14d' },
    );

    const { password, ...user } = userInfo._doc;

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.json({
      message: 'Нет доступа.',
    });
  }
};

export const getAuthor = async (req, res) => {
  try {
    const id = req.params.authorId;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        message: 'Такого пользователя не существует.',
      });
    }

    const { password, email, ...author } = user._doc;

    res.status(200).json({
      author,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Нет доступа.',
    });
  }
};

export const subscription = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const userId = req.userId;
    let message = '';

    if (authorId === userId) {
      return res.status(400).json({ message: 'Вы не можете подписываться на себя.' });
    }

    const author = await User.findById(authorId);
    const user = await User.findById(userId);

    if (user.subscriptions.includes(authorId)) {
      user.subscriptions = user.subscriptions.filter((id) => id.toString() !== authorId);
      author.followers = author.followers > 0 ? (author.followers -= 1) : 0;
      message = `Вы отписались | ${author.fullname}`;
    } else {
      user.subscriptions.unshift(authorId);
      author.followers += 1;
      message = `Вы подписались | ${author.fullname}`;
    }
    await author.save();
    await user.save();

    const subs = user.subscriptions;

    res.status(200).json({ message, subs });
  } catch (err) {
    console.log(err);
    res.json({
      error: err.message,
      message: 'Подписка не обновлена.',
    });
  }
};

export const getSubs = async (req, res) => {
  try {
    const userId = req.userId;
    const subs = [];

    const user = await User.findById(userId).populate('subscriptions');

    if (!user) return res.status(400).json({ message: 'Пользователь не найден' });

    for (let sub of user.subscriptions) {
      let navItem = {
        fullname: sub.fullname,
        id: sub._id,
        ava: sub?.imageUrl,
        description: sub?.description,
        followers: sub.followers,
        postsCount: sub.posts?.length,
      };
      subs.push(navItem);
    }

    res.status(200).json({ subs });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
};

export const userUpdate = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullname, email, description, imageUrl } = req.body;
    
    const user = await User.findByIdAndUpdate({_id: userId}, {fullname, email, description, imageUrl}, {new: true});

    if (!user) return res.json({message: 'Пользователь не найден'});

    res.json({message: 'Информация обновлена', user});

  } catch (error) {
    console.log(error);
    res.json({ message: 'Ошибка при обновлении пользователя' });
  }
};
