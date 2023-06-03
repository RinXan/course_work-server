import { Router } from "express";
import { getAll } from "../controllers/PostController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { subscription } from "../controllers/UserController.js";
const router = Router();
router.get('/:authorId', getAll);
router.put('/:authorId', checkAuth, subscription);
export default router;