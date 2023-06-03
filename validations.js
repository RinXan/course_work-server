import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Введите адрес электронной почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 5 символов').isLength({min:5}),
]

export const registerValidation = [
    body('fullname', 'Имя пользователя должно содержать не меньше 3 символов').isLength({min:3}),
    body('email', 'Введите адрес электронной почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 5 символов').isLength({min:5}),
]

export const postCreateValidation = [
    body('title', 'Слишком короткий заголовок').isLength({min:3}).isString(),
    body('text', 'Слишком короткий текст статьи').isLength({min:3}).isString(),
    body('tags', 'Неверный формат тегов').optional().isString(),
]

export const commentValidation = [
    body('text', 'Слишком короткий комментарий').isLength({min:1, max: 255}).isString(),
]