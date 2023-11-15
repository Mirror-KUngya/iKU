const express = require("express");
const User = require("../models/User");
const CheckList = require("../models/CheckList")
const router = express.Router();
const date = require("../utils/date");
const bycrypt = require("bcryptjs"); // 암호화 모듈
//const authenticateJWT = require("../middleware/authenticate");
//const authorizeRoles = require("../middleware/authorize");

// ID 중복확인
router.post("/isDuplicated", async (req, res) => {
  const { UserID } = req.body;
  // ID 길이 확인 추가
  if (UserID != null) {
    try {
      let user = await User.findOne({ UserID });
      if (user) {
        console.log("ID already exists.");
        return res.status(202).json({ "message": "User already exists." });
      }
      return res.status(201).json({ "NewUserID": UserID });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ "message": error.message });
    }
  } else {
    return res.status(500).json({ "message": error.message });
  }

});

// 노인 회원 가입 여부
router.post("/isExist", async (req, res) => {
  const { UserID } = req.body;
  try {
    let user = await User.findOne({ UserID });
    if (user) {
      console.log("ID already exists.");
      return res.status(200)
    }
    return res.status(404)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ "message": error.message });
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
    GuardPhone,
    DeviceToken
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
      UserAddress: UserAddress,
      UserID: UserID,
      UserPW: UserPW,
      BirthYear: BirthYear,
      BirthMonth: BirthMonth,
      BirthDay: BirthDay,
      UserType: UserType,
      GuardPhone: GuardPhone,
      Mission: {
        MissionDate: date.formatDate(),
        Clap: false,
        Smile: false,
        Exercise: false,
        WordChain: false
      },
      Notice_hasCompleted: true,
      Notice_ifNon: true,
      DeviceToken: DeviceToken
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
    SilverPW,
    GaurdDeviceToken
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
        Notice_ifNon: true,
        GaurdDeviceToken: GaurdDeviceToken
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
      return res.status(202).json({ "message": "ID or Password is wrong." });
    }

    // 로그인 성공
    return res.status(200).json({ "UserID": user.UserID, "UserName": user.UserName });
  } catch (error) { // 로그인 실패
    return res.status(500).json({ "error": error.message });
  }
});

// 이름 조회
router.get("/:UserID", async (req, res) => {
  try {
    const UserID = req.params.UserID;
    const user = await User.findOne({ UserID: UserID });
    if (user) {
      return res.status(200).json({
        UserID: UserID,
        UserName: user.UserName
      });
    }
    return res.status(404).json({ "message": "User does not exist." });
  } catch (error) {
    return res.status(500).json({ "error": error.message });
  }
})

// 아이디 찾기
router.post("/findID", async (req, res) => {
  const { UserName ,UserPhone } = req.body;
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

// 비밀번호 리셋을 위한 회원조회
router.get("/findUser/:UserID/:UserPhone", async (req, res) => {
  const UserID = req.params.UserID;
  const UserPhone = req.params.UserPhone;

  try {
    const user = await User.findOne({UserID: UserID});
    if (!user) {
      return res.status(404).json({ "message": "User does not exist." });
    }
    if (UserPhone == user.UserPhone) {
      return res.status(200).send("사용자 조회 성공");
    }
    console.log("사용자 조회 성공");
    return res.status(404).json({ "message": "User does not exist." });
  } catch(error) {
    return res.status(500).json({ "message": error.message });
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

router.delete("/", async (req, res) => {
  const { UserID } = req.body;

  try {
    // 사용자 정보 찾기
    const user = await User.findOne({ UserID });
    const checkList = await CheckList.findOne({ UserID });

    let userDeleted = false;
    let checkListDeleted = false;

    if (user) {
      // 사용자 정보 삭제
      await User.deleteOne({ UserID });
      userDeleted = true;
    }

    if (checkList) {
      // 체크리스트 정보 삭제
      await CheckList.deleteOne({ UserID });
      checkListDeleted = true;
    }

    // 사용자 정보와 체크리스트 정보가 모두 존재하지 않는 경우
    if (!userDeleted && !checkListDeleted) {
      return res.status(404).json({ "message": "User does not exist." });
    }

    // 삭제 성공 메시지
    return res.status(200).json({ "message": "User and associated data deleted successfully." });

  } catch(error) {
    // 서버 오류 처리
    return res.status(500).json({ "message": error.message });
  }
});


module.exports = router;