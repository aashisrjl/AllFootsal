const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, options = {}) => {
  const {
    folder = 'allfutsal',
    resource_type = 'auto',
    overwrite = true,
    use_filename = false,
    unique_filename = false,
  } = options;

  return cloudinary.uploader.upload(filePath, {
    folder,
    resource_type,
    overwrite,
    use_filename,
    unique_filename,
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
