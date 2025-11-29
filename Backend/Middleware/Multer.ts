import multer from 'multer';
import { storage } from '../Utils/cloudinary';

// Tạo middleware upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // giới hạn 2MB
});

export default upload;
