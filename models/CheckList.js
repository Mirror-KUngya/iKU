const mongoose = require("mongoose")

// Schema 생성
const CheckListSchema = new mongoose.Schema({
    UserID: {
        type: String,
        unique: true,
        required: true
    },
    List: [
        {
            toDo: {
                type: String
            }
        }
    ]
});

module.exports = CheckList = mongoose.model("CheckList", CheckListSchema, "CheckList")