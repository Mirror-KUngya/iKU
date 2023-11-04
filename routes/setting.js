const express = require("express");
const User = require("../models/User");
const router = express.Router();

// 비상 가드 연락망 수정
router.put("/", async (req, res) => {
    const { UserID, newGuardPhone } = req.body;
    try {
        let user = await User.findOne({ UserID });
        if (!user) {
            console.log("User doesn't exist.");
            return res.status(404).json({ "message": "User does not exist." });
        }
        user.updateOne({GuardPhone: newGuardPhone});
        return res.status(200).json({"newGuardPhone": newGuardPhone});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error")
    }
});
module.exports = router;