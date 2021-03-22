const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// const fileFilter = (req, file, cb) => {
//   // fileFilter는 storage와 위치가 다르다
//   let ext = path.extname(file.originalname);
//   if (ext !== ".mp4") {
//     return cb(new Error("only jpg, png is allowed"), false);
//   } else {
//     return cb(null, true);
//   }
// };

let upload = multer({ storage }).single("file");

//=================================
//             Video
//=================================

router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body);
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });

    res.status(200).json({ success: true });
    console.log("이게뭔데? doc", doc);
  });
});

router.post("/thumbnail", (req, res) => {
  //썸네일 생성하고 비디오 러닝타임도 가져오기

  let filePath = "";
  let fileDuration = "";

  //썸네일 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    // console.dir(metadata);
    // console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  //썸네일 생성
  ffmpeg(req.body.url)
    .on("filenames", (filenames) => {
      console.log("Will generate", filenames.join(", "));
      console.log("파일네임", filenames);

      filePath = "uploads/thumbnails/" + filenames[0]; //3장중에 첫번째꺼
      console.log("파일패뜨", filePath);
    })

    .on("end", function () {
      console.log("스크린샷 촬영 완료 ~!!");
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // take screenshots 20$ 40$ 60% and 80%
      count: 3,
      folder: "uploads/thumbnails",
      size: "320x240",
      //'%b' input basename
      filename: "thumbnail-%b.png",
    });
});

router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }

    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
