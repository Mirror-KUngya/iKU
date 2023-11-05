const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const connectDB = require("./config/mongoDB");

var userRouter = require("./routes/user");
var missionRouter = require("./routes/mission");
var checkListRouter = require("./routes/checkList");
var settingRouter = require("./routes/setting");

connectDB.mongoDB() //DB 연결

app.use(express.json({extended: false})) // req의body 정보를 읽을 수 있도록 설정
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))

app.use('/users', userRouter);
app.use('/missions', missionRouter);
app.use('/checkList', checkListRouter);
app.use('/setting', settingRouter);

express.Router().get('/test', async (req, res) => {
    res.json({"test": "success"});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});