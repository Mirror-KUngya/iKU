const express = require("express");
const User = require("../models/User");
const router = express.Router();
const date = require("../utils/date");
const bycrypt = require("bcryptjs"); // 암호화 모듈
const formatDate = require("../utils/date");
//const authenticateJWT = require("../middleware/authenticate");
//const authorizeRoles = require("../middleware/authorize");

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
    return res.status(500).json({ "message": error.message });
  }
});

// 노인 회원 가입 여부
router.post("/isExist", async (req, res) => {
  const { SilverID, SilverPW } = req.body;
  try {
    let silverUser = await User.findOne({ UserID: SilverID });
    if (!silverUser) {
      return res.status(401).json({ "message": "User does not exists." });
    }
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
});

// 노인 회원가입
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
  } = req.body;

  try {
    let user = await User.findOne({ UserPhone });
    if (user) {
      console.log("User already exists.");
      return res.status(401).json({ "message": "User already exists." });
    }
    user = new User({
      UserName: UserName,
      UserPhone: UserPhone,
      // UserAddress,
      UserID: UserID,
      UserPW: UserPW,
      BirthYear: BirthYear,
      BirthMonth: BirthMonth,
      BirthDay: BirthDay,
      UserType: UserType,
      Mission: {
        MissionDate: date.formatDate(),
        Clap: false,
        Smile: false,
        Exercise: false,
        WordChain: false
      },
      Notice_hasCompleted: true,
      Notice_ifNon: true, // 나중에 디바이스 토큰 값 추가
    });

    // 비밀번호 암호화
    user.UserPW = await bycrypt.hash(UserPW, 10);

    await user.save();
    return res.status(201).json({ "UserID": user.UserID });

  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
});

// 보호자 회원가입
router.post("/signUpGaurd", async (req, res) => {
  const {
    UserID,
    UserPW,
    UserType,
    UserName,
    UserPhone,
    RelationshipWithSilver,
    SilverID,
    SilverPW
  } = req.body;

  try {
    const user = await User.findOne({ UserID: SilverID });
    if (user && UserType === "보호자 회원") {
      user.Gaurd = {
        GaurdName: UserName,
        GuardID: UserID,
        GuardPW: UserPW,
        GuardPhone: UserPhone,
        UserType: UserType,
        RelationshipWithSilver: RelationshipWithSilver,
        SilverID: SilverID,
        SilverPW: SilverPW,
        Notice_hasCompleted: true,
        Notice_ifNon: true
      }
      // FCM 디바이스 토큰
      await user.save();
      console.log("보호자 정보");
      return res.status(200).json({ UserID: UserID });
    }
  } catch (error) {
    console.log(error);
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
    return res.status(200).json({ "UserID": user.UserID, "UserName": user.UserName });
  } catch (error) { // 로그인 실패
    return res.status(500).json({ "error": error.message });
  }
});

// 아이디 찾기
router.post("/findID", async (req, res) => {
  const { UserPhone } = req.body;
  // 이름, 전화번호롤 찾기
  try {
    const user = await User.findOne({ UserPhone });

    if (!user) {
      return res.status(404).json({ "message": "User does not exist." });
    }

    res.status(200).json({ "UserID": user.UserID });
  }
  catch (error) {
    res.status(500).json({ "message": error.message });
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
      return res.status(200).json({ "message": "Password has been reset successfully." });
    }
    else {
      return res.status(401).json({ "message": "Phone number does not match." });
    }

  } catch (error) {
    return res.status(500).json({ "message": error.message });
  }
});

module.exports = router;