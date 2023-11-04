const express = require("express");
const router = express.Router();
const CheckList = require("../models/CheckList");

// 체크리스트 조회
router.get("/", async (req, res) => {
    const { UserID } = req.body;
    try {
        let checkList = await CheckList.findOne({ UserID });
        if (!checkList) {
            console.log("ID doesn't exist.");
            return res.status(404).json({ "message": "User dose not exist." });
        }
        return res.status(200).json(checkList.List);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ "message": "Server Error" })
    }
});

// 체크리스트 항목 추가
router.post("/", async (req, res) => {
    const { UserID, toDo } = req.body;
    try {
        const result = await CheckList.findOneAndUpdate(
            { UserID },
            { $push: { List: { toDo } } },
            { new: true, upsert: true }
        );
        return res.status(201).json({ "addMission": toDo });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": error.message });
    }
});

// 체크리스트 항목 삭제
router.delete("/", async (req, res) => {
    const { UserID, toDo } = req.body;
    try {
        const result = await CheckList.findOneAndUpdate(
            { UserID },
            { $pull: { List: { toDo } } },
            { new: true }
        );
        if (result) {
            res.status(200).json({ "deleteMission": toDo });
        } else {
            res.status(404).json({ "message": "User dose not exist." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": error.message });
    }
});

module.exports = router;