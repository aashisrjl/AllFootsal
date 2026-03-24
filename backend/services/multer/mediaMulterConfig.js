const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = (file.mimetype.split("/")[1] || "bin").toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith("image/")) return cb(null, true);
  if (file.mimetype?.startsWith("video/")) return cb(null, true);
  return cb(new Error("Only image/video are allowed"), false);
};

const mediaUpload = multer({ storage, fileFilter });

module.exports = {
  mediaUpload,
};

