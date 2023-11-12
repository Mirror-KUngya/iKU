const admin = require('firebase-admin');
const date = require("./date");

const sendPushNotification = (device_token) => {
  // 푸시 메시지 설정
  var message = {
    notification: {
      title: '미션 완료 알림',
      body: date.formatDate() + " 모든 미션을 성공적으로 완료하였습니다.!"
    },
    token: device_token
  };

  // 푸시 메시지 보내기
  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
};

module.exports = sendPushNotification;
