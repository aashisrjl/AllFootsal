const multer = require('multer');
const path = require('path');

const uploadPath = path.join(__dirname, '../../uploads');

// filter the images only allowed to upload
const storage = multer.diskStorage({
    filename: function(req,file,cb){
        if(file.mimetype.startsWith('image/')){
            cb(null,file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
        }else{
            cb(new Error('Only images are allowed'),false)
        }
    },
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
})
const upload = multer({ storage: storage })

module.exports = {
    upload
}