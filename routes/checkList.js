const express = require("express");
const router = express.Router();
const CheckList = require("../models/CheckList");

// 체크리스트 조회
router.get("/:UserID", async (req, res) => {
    const UserID = req.params.UserID;
    try {
        let checkList = await CheckList.findOne({ UserID });
        if (!checkList) {
            // 체크리스트 추가
            checkList = new CheckList({UserID: UserID});
            await checkList.save();
        }
        // List의 모든 항목 출력
        if (checkList.List && checkList.List.length > 0) {
            checkList.List.forEach(item => {
                console.log(item.toDo);
            });
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
        // 먼저 해당 UserID의 체크리스트를 찾습니다.
        const checkList = await CheckList.findOne({ UserID });

        if (checkList && checkList.List.some(item => item.toDo === toDo)) {
            // toDo 항목이 리스트에 존재하는 경우, 해당 항목을 삭제합니다.
            const result = await CheckList.findOneAndUpdate(
                { UserID },
                { $pull: { List: { toDo } } },
                { new: true }
            );
            console.log(result);
            res.status(200).json({ "deleteMission": toDo });
        } else {
            // toDo 항목이 리스트에 존재하지 않는 경우
            res.status(404).json({ "message": "해당 미션을 찾을 수 없습니다" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": error.message });
    }
});


module.exports = router;