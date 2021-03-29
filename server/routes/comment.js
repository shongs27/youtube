const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//             Subscribe
//=================================

//============================
//          구독정보
//============================
router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    //populate('writer')를 save메소드 뒤에 바로 쓸수 없다
    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComment", (req, res) => {
  //작명을 postId가 아니라 videoId로 하는게 더 맞았네
  Comment.find({ postId: req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
      console.log(comments);
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
