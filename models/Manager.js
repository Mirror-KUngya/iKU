const mongoose = require("mongoose")

// Schema 생성
const ManagerSchema = new mongoose.Schema({
    ManagerName: {
        type: String,
        required: true
    },
    ManagerPhone: {
        type: String,
        required: true
    },
    ManagerID: {
        type: String,
        unique: true,
        required: true
    },
    ManagerPW: {
        type: String,
        required: true
    }
})

module.exports = Manager = mongoose.model("Managers", ManagerSchema, "Managers");