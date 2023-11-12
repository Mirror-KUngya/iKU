const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const connectDB = require('./config/mongoDB');

const userRouter = require('./routes/user');
const missionRouter = require('./routes/mission');
const checkListRouter = require('./routes/checkList');
const settingRouter = require('./routes/setting');
const detectRouter = require('./routes/detect'); // 인공지능 인식
const noticeRouter= require('./routes/notice');

connectDB.mongoDB(); //DB 연결

app.use(cors());
app.use(express.json({extended: false})); // req의body 정보를 읽을 수 있도록 설정
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

// console.log("access token");
// console.log(require('crypto').randomBytes(64).toString('hex'));
// console.log("refresh token");
// console.log(require('crypto').randomBytes(64).toString('hex'));

app.use('/users', userRouter);
app.use('/missions', missionRouter);
app.use('/checkList', checkListRouter);
app.use('/setting', settingRouter);
app.use('/detect', detectRouter);
app.use('/notice', noticeRouter);

app.get('/test', (req, res) => {
  res.json({test: 'success'});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
