const express = require("express");
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscribe
//=================================

//============================
//          구독정보
//============================
router.post("/subscribeNumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo })
    //여러명이면 subscribe는 여러개.. 어떻게 여러명일 수가 있지?
    .exec((err, subscribe) => {
      if (err) return res.status(400).send(err);
      return res
        .status(200)
        .json({ success: true, subscribeNumber: subscribe.length });
    });
});

router.post("/subscribed", (req, res) => {
  Subscriber.find({
    userTo: req.body.userTo,
    userForm: req.body.userFrom,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    //userTo writer에 영상에 하나라도 userFrom이 구독하고 있다면
    let result = false;
    if (subscribe.length !== 0) {
      //result를 true로 전환해서
      result = true;
    }
    res.status(200).json({ success: true, subscribed: result });
  });
});
//============================
//          구독클릭
//============================

router.post("/unsubscribed", (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

router.post("/subscribe", (req, res) => {
  const subscribe = new Subscriber(req.body);

  subscribe.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
