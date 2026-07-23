const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv|xls|xlsx)$/i)) {
            return cb(new Error('Only CSV and Excel files are allowed'));
        }
        cb(null, true);
    }
});

module.exports = upload;
