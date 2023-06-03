import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { checkAuth } from '../middleware/checkAuth.js';

import fileMiddleware from '../middleware/file.js';

const router = Router();

router.post('/', checkAuth, fileMiddleware.single('image'), (req, res) => {
  res.json({
    // url: `/uploads/${req.userId}/${req.uploadedfileName}`,
    url: `/uploads/${req.uploadedfileName}`,
  });
});

// router.post('/video', checkAuth, fileMiddleware.single('video'), (req, res) => {
//   res.json({
//     url: `/uploads/${req.userId}/${req.uploadedfileName}`,
//   });
// });

router.put('/update', checkAuth, async (req, res) => {
  try {
    const { postId, name, userId } = req.body;
    let deleteImageObj = {};

    if (postId) {
      deleteImageObj = await Post.findById(postId);
    } else if (userId) {
      deleteImageObj = await User.findById(userId);
    } else if (name) {
      deleteImageObj.imageUrl = name;
    } else {
      return res.json({ success: false, message: 'postId, userId, name are undefined' });
    }

    if (!deleteImageObj?.imageUrl) {
      deleteImageObj.imageUrl = name;
    }

    const filePath = path.join('.', deleteImageObj.imageUrl);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }
    });

    deleteImageObj.imageUrl = null;

    if (postId || userId) {
      await deleteImageObj.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error while deleting image' });
  }
});

export default router;
