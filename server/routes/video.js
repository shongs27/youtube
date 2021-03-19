const express = require("express");
const router = express.Router();
// const { Video } = require("../models/Video");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  // fileFilter: (req, file, cb) => {
  //   const ext = path.extname(file.originalname);

  //   // if (ext !== ".mp4") {
  //   //   return cb(res.status(400).end("mp4 파일만 등록할 수 있습니다"), false);
  //   // }
  //   cb(null, true);
  // },
});
var upload = multer({ storage: storage }).single("file"); //파일은 하나씩만

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
  // 비디오를 서버에 저장한다
  //npm i multer

  upload((req, res, err) => {
    if (err) {
      return res.json({ success: false, err });
    }

    return res.json({
      success: true,
      // filePath: res.req.file.path,
      // fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
