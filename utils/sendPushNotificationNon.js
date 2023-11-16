const admin = require('firebase-admin');
const date = require("./date");

module.exports.sendPushNotificationNon = (res, device_token, mission) => {
  // 푸시 메시지 설정
  var message = {
    notification: {
      title: '※경고: 미션 불이행 알림',
      body: date.formatDate() + " 아무 미션도 수행하지 않았습니다.\n 연락을 시도해보세요."
    },
    token: device_token
  };

  admin
    .messaging()
    .send(message)
    .then(function (response) {
      console.log('Successfully sent message: : ', response)
      return res.status(200).json({ success: true, mission })
    })
    .catch(function (err) {
      console.log('Error Sending message!!! : ', err)
      return res.status(400).json({ success: false, mission })
    });
};
