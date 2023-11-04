const express = require("express");
const User = require("../models/User");
const router = express.Router();
const date = require("../config/date");
const bycrypt = require("bcryptjs"); // 암호화 모듈
const formatDate = require("../config/date");
var nowID = "";

// ID 중복확인
router.post("/isDuplicated", async (req, res) => {
  const { UserID } = req.body;
  try {
    let user = await User.findOne({ UserID });
    if (user) {
      console.log("ID already exists.");
      return res.status(401).json({ "message": "User already exists." });
    }
    return res.status(201).json({ "NewUserID": UserID });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({"message": error.message});
  }
});

// 회원가입
router.post("/signUp", async (req, res) => {
  const {
    UserName,
    UserPhone,
    UserAddress,
    UserID,
    UserPW,
    BirthYear,
    BirthMonth,
    BirthDay,
    UserType,
    GuardPhone,
    Relationship } = req.body;

  try {
    let user = await User.findOne({ UserPhone });
    if (user) {
      console.log("User already exists.");
      return res.status(401).json({ "message": "User already exists." });
    }
    user = new User({
      UserName,
      UserPhone,
      UserAddress,
      UserID,
      UserPW,
      BirthYear,
      BirthMonth,
      BirthDay,
      UserType,
      GuardPhone,
      Relationship,
      Mission: {
        MissionDate: date.formatDate(),
        Smile: false,
        Game: false,
        Exercise: false,
        Movement: false
      }
    });

    // 비밀번호 암호화
    user.UserPW = await bycrypt.hash(UserPW, 10);

    await user.save();
    return res.status(201).json({"UserID":user.UserID});

  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
});

// 로그인
router.post("/signIn", async (req, res) => {
  try {
    const { UserID, UserPW } = req.body;
    const user = await User.findOne({ UserID });

    if (!user) {
      return res.status(404).json({ "message": "User does not exist." });
    }

    // bycrypt를 사용하여 입력된 비밀번호와 저장된 해시된 비밀번호를 비교
    const isMatch = await bycrypt.compare(UserPW, user.UserPW);
    if (!isMatch) {
      return res.status(401).json({ "message": "ID or Password is wrong." });
    }

    // 로그인 성공
    return res.status(200).json({ "UserID": user.UserID});
  } catch (error) { // 로그인 실패
    return res.status(500).json({ "error": error.message });
  }
});

// 아이디 찾기
router.post("/findID", async (req, res) => {
  const { UserPhone } = req.body;

  try {
    const user = await User.findOne({ UserPhone });

    if (!user) {
      return res.status(404).json({ "message": "User does not exist." });
    }

    res.status(200).json({ "UserID": user.UserID });
  }
  catch (error) {
    res.status(500).json({"message": error.message});
  }
});

// user 확인 후 비밀번호 재설정
router.post("/findPW", async (req, res) => {
  const { UserID, UserPhone, newPW } = req.body;

  try {
    const user = await User.findOne({ UserID });

    if (!user) {
      return res.status(404).json({ "message": "User does not exist." });
    }
    if (UserPhone == user.UserPhone) {
      // 비밀번호 재설정
      const salt = await bycrypt.genSalt(10);
      user.UserPW = await bycrypt.hash(newPW, salt);
      await user.save();
      return res.status(200).json({"message": "Password has been reset successfully."});
    }
    else {
      return res.status(401).json({"message": "Phone number does not match."});
    }

  } catch (error) {
    return res.status(500).json({"message": error.message});
  }
});

module.exports = router;