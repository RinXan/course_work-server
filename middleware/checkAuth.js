import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1];

  try {
    if (token == 'null') {
      return res.json({
        message: 'Пользователь не авторизован, отсутствует токен.',
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({
      message: 'Пользователь не авторизован.',
    });
  }
};
