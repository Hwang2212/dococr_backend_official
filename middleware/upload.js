import multer from 'multer'; 
import path from 'path';

// Storing File in Storage
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (request, file, callback)=>{
        callback(null, file.originalname);
    }
});

// Filtering Files
const fileFilter = (request, file, callback)=>{

    const validExts = [".png", ".jpg", ".jpeg", ".pdf"];

    if (!validExts.includes(path.extname(file.originalname))) {
        return callback(new Error("Only .png, .jpeg and .jpg format allowed"))
    }

    const fileSize = parseInt(request.headers["content-length"]);

    callback(null, true)
};

export let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 1048576
});
