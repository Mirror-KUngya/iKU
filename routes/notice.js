const admin = require('../config/Firebase');
const User = require("../models/User");
const express = require('express');
const router = express.Router();
const scheduleJob = require('../utils/scheduleJob');
const sendPushNotification = require('../utils/sendPushNotification');

// 토큰 저장 API
router.post('/token', async (req, res) => {
  const token = req.body.token;
  //const userID = req.body.UserID;
  console.log('Received token:', token);
  scheduleJob(sendPushNotification, token)

  // try {
  //   const user = await User.findOne({"UserID": userID});
  //   if (!user) {
  //     return res.status(404).json({ "message": "User does not exist." });
  //   }
  //   user.Device_token = token; // 토큰 DB에 저장
  //   scheduleJob(sendPushNotification, token)
  //   await user.save();
  //   return res.send(200).send("DB에 토큰 저장 완료")
  // } catch (error) {
  //   console.log("토큰 오류");
  //   console.log(error.message);
  //   res.status(500).send(error.message);
  // }
});


// Firebase Realtime Database에 데이터 저장
router.post('/save', async (req, res) => {
  const { data } = req.body; // 요청 본문에서 key와 data를 추출합니다.
  console.log(req.body);
  // 데이터를 저장할 경로를 정의합니다.
  const ref = admin.database().ref(`test`);

  try {
    // set 메소드를 사용해 데이터를 저장합니다.
    await ref.set(req.body);
    res.status(200).send('Data saved successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;