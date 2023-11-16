const admin = require('firebase-admin');
const date = require("./date");

module.exports.sendPushNotificationAll = (res, device_token, mission) => {
  var message = {
    notification: {
      title: '미션 완료 알림',
      body: date.formatDate() + " 모든 미션을 성공적으로 완료하였습니다.!"
    },
    token: device_token
  };

  // 푸시 알림 전송 시도 (성공 여부와 상관없이 진행)
  admin.messaging().send(message)
    .then(response => {
      console.log('Successfully sent message: : ', response);
    })
    .catch(err => {
      console.log('Error Sending message!!! : ', err);
    });

  // 푸시 알림 전송 결과와 상관없이 미션 정보를 응답으로 전송
  res.status(200).json({ success: true, mission });
};
