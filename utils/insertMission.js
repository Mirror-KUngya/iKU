const cron = require("node-cron");
const date = require("./date");
const user = require("../models/User");

// 매일 00시에 해당 날짜 미션 초기화
const insertMission = (sendPushNotification, device_token) => {
    cron.schedule('0 0 0 * * *', () => {
        // let mission = user.Mission.find(m => m.MissionDate === MissionDate);
        // if (!mission) {
        //     mission = { MissionDate: MissionDate, Smile: false, Game: false, Exercise: false, Movement: false };
        //     user.Mission.push(mission);
        //     await user.save();
        // }
    });
};

module.exports = insertMission;
