import { Router } from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { getAuthor, getSubs, userUpdate } from '../controllers/UserController.js'

const router = Router();

router.get('/subs', checkAuth, getSubs);
router.get('/:authorId', getAuthor);

// LC
router.put('/', checkAuth, userUpdate);
// router.get('/:authorId', getAuthor);
// router.get('/:authorId', getAuthor);

export default router;