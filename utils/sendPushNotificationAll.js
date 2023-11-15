const admin = require('firebase-admin');
const date = require("./date");

module.exports.sendPushNotificationAll = (device_token) => {
  // 푸시 메시지 설정
  var message = {
    notification: {
      title: '미션 완료 알림',
      body: date.formatDate() + " 모든 미션을 성공적으로 완료하였습니다.!"
    },
    token: device_token
  };

  admin
    .messaging()
    .send(message)
    .then(function (response) {
      console.log('Successfully sent message: : ', response)
      return res.status(200).json({ success: true })
    })
    .catch(function (err) {
      console.log('Error Sending message!!! : ', err)
      return res.status(400).json({ success: false })
    });
};
