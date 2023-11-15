const admin = require('../config/Firebase');
const User = require("../models/User");
const express = require('express');
const router = express.Router();
const scheduleJob = require('../utils/scheduleJob');
const sendPushNotification = require('../utils/sendPushNotificationAll');

// 토큰 저장 API
router.post('/token', async (req, res) => {
  const token = req.body.token;
  //const userID = req.body.UserID;
  console.log('Received token:', token);
  scheduleJob(sendPushNotification, token)
});

// 받은 토큰으로 알림 보내기
router.post("/all/:token", async(req, res)=>{

  let target_token =req.params.token;
	//target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다

  let message = {
    notification: {
      title: '테스트 데이터 발송',
      body: '데이터가 잘 가나요?',
    },
    token: target_token,
  }

  admin
    .messaging()
    .send(message)
    .then(function (response) {
      console.log('Successfully sent message: : ', response)
      return res.status(200).json({success : true})
    })
    .catch(function (err) {
        console.log('Error Sending message!!! : ', err)
        return res.status(400).json({success : false})
    });
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