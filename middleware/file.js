import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  // destination: (req, file, cd) => {
  //   const userId = req.userId;
  //   const uploadDir = path.join('.', 'uploads', userId);
  //   fs.mkdir(uploadDir, (err) => {
  //     if (err) console.log(err);
  //   });
  //   cd(null, uploadDir);
  // },
  destination: (_, __, cd) => {
    cd(null, 'uploads');
  },
  filename: (req, file, cd) => {
    let fileName = Date.now() + '_' + file.originalname;
    req.uploadedfileName = fileName;
    cd(null, fileName);
  },
});

// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

export const videoUpload = multer({})

export default multer({ storage, limits: { fileSize: 100_000_000 } }); // max file size | 1MB = 1_000_000 bytes
