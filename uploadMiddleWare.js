const fs = require('fs');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/sejin4430@gmail.com';
        var stat = null;
        try {
            stat = fs.statSync(dir);
        } catch(e) {
            fs.mkdirSync(dir);
        }
        if(stat && !stat.isDirectory())
            console.log('Cannot make new directory');

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        cb(null, basename + '_' + Date.now() + extension);
    }
});

const fileFilter = (req, file, cb) => {
    let extension = path.extname(file.originalname);
    if(extension !== '.jpg' && extension !== '.jpeg')
        return cb(null, false);
    return cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;