const express = require("express");
const userR = require("./user");
const User = require("../models/User");
const date = require("../config/date");
const userID = userR.nowID;
const router = express.Router();

// mission 날짜별로 조회
// mission 날짜 조회 시 예외 발생 시 해당 날짜 data 삽입
// res에 날짜, 미션 완료 여부
router.get("/", async (req, res) => {
    const { UserID, MissionDate } = req.body;

    try {
        const user = await User.findOne({ "UserID": UserID });
        if (!user) {
            return res.status(404).json({ "message": "User does not exist." });
        }
        let mission = user.Mission.find(m => m.MissionDate === MissionDate);
        if (!mission) {
            mission = { MissionDate: MissionDate, Smile: false, Game: false, Exercise: false, Movement: false };
            user.Mission.push(mission);
            await user.save();
        }

        console.log(mission)
        return res.status(200).json(mission);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error")
    }
});

// 미션 완료한 거 수정 (false -> true)
router.put("/", async (req, res) => {
    try {
        const { UserID, MissionDate, completeMission } = req.body;
        const result = await User.updateOne({
            "UserID": UserID,
            "Mission.MissionDate": MissionDate
        },
        {
            $set: {
                ["Mission.$." + completeMission]: true
            }
        });

        if (result.matchedCount === 0) {
            return res.status(404).json({ "message": "User or Mission not found" });
        }

        res.status(200).json({
            "UserID": UserID,
            "MissionDate": MissionDate,
            [completeMission]: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = router;