const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");

const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

//=================================
//             Video
//=================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});


let upload = multer({ storage }).single("file");

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

router.get("/getVideos", (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에 렌더링
  Video.find()
    .populate("writer") //populate해야 모델정보 다가져옴
    .exec((err, allvideos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, allvideos });
    });
});

router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    //populate로 다 가자오기
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body);
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });

    res.status(200).json({ success: true });
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

router.post("/getSubscriptionVideos", (req, res) => {
  // 자신의 아이디를 가지고 구독하는 사람들을 찾는다
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).send(err);
      //userTo 정보
      let subscribedUser = [];
      subscriberInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });

      // 찾은 사람들의 비디오를 가지고 온다

      // 여러명일때는 $in이라는 mongoDB method를 사용한다
      Video.find({ writer: { $in: subscribedUser } })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    }
  );
});

module.exports = router;
