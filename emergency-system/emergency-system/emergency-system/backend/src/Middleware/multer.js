import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Check karein ke 'uploads' folder exist karta hai, warna bana dein
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Files yahan save hongi
    },
    filename: (req, file, cb) => {
        // File ka naam unique rakhne ke liye timestamp aur random number lagana
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 3. File Filter (Sirf PDF aur Images allow karne ke liye)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Sirf PDF ya Images upload ki ja sakti hain!'), false);
    }
};

// 4. Final Middleware
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB Limit
});