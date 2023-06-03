import { Router } from 'express';
import { create, getAll, getPopular, getLiked, update, remove, getOne, likeUnlike, getPostsBySearch } from '../controllers/PostController.js';
import { addComment, removeComment, getComments, removeAllComments } from '../controllers/CommentController.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { postCreateValidation, commentValidation } from '../validations.js';

const router = Router();

// --------------------- Posts --------------------------

router.get('/search', getPostsBySearch);
router.get('/popular', getPopular);
router.get('/', getAll);
router.get('/:authorId/own', checkAuth, getAll);
router.get('/liked', checkAuth, getLiked);
router.get('/:id', getOne);
router.post('/', checkAuth, postCreateValidation, create);
router.put('/:id', checkAuth, postCreateValidation, update);
router.delete('/:id', checkAuth, remove);

// --------------------- Comments --------------------------

router.get('/:id/comments', getComments);
router.post('/:id/comments',  checkAuth, commentValidation, addComment);
router.delete('/:id/comments/:commentId', checkAuth, removeComment);
router.delete('/:id/deletecomments', checkAuth, removeAllComments);

// --------------------- Like and Unlike --------------------------

router.put('/:id/like', checkAuth, likeUnlike)


export default router;