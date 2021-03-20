const express = require("express");
const router = express.Router();
// const { Video } = require("../models/Video");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },

  fileFilter: (req, file, cb) => {
    //왜 png, jpg 파일은 안걸릴까?
    const ext = path.extname(req.file.filename);
    console.log("안녕");
    console.log(ext);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    } else {
      cb(null, true);
    }
  },
});
var upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    const ext = path.extname(res.req.file.filename);
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
      fileExt: ext,
    });
  });
});

module.exports = router;
