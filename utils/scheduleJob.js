const cron = require('node-cron');

// 매일 오후 8시에 알림 보내기
const scheduleJob = (sendPushNotification, device_token) => {
  cron.schedule('0 42 22 * * *', () => {
    sendPushNotification(device_token);
  });
};

module.exports = scheduleJob;
