// upload.js

import multer from 'multer';

// Use memory storage to store files in memory
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
