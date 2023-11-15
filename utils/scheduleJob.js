const cron = require('node-cron');
const push = require("./sendPushNotificationNon")

// 매일 오후 8시에 알림 보내기
module.exports.scheduleJob = (device_token) => {
  cron.schedule('0 0 20 * * *', () => {
    push.sendPushNotificationNon(device_token);
  });
};