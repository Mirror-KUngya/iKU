const mongoose = require("mongoose")

// Schema 생성
const UserSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    UserPhone: {
        type: String,
        required: true
    },
    UserAddress: {
        type: String,
        required: true
    },
    UserID: {
        type: String,
        unique: true,
        required: true
    },
    UserPW: {
        type: String,
        required: true
    },
    BirthYear: {
        type: Number,
        required: true
    },
    BirthMonth: {
        type: Number,
        required: true,
    },
    BirthDay: {
        type: Number,
        required: true,
    },
    UserType: {
        type: String,
        required: true
    },
    GuardPhone: {
        type: String
    },
    Relationship: {
        type: String
    },
    Mission: [{
        MissionDate: {
            type: String,
            required: true
        },
        Clap: {
            type: Boolean
        },
        Smile: {
            type: Boolean
        },
        Exercise: {
            type: Boolean
        },
        WordChain: {
            type: Boolean
        }
    }],
    Gaurd: {
        GuardID: {
            type: String,
            unique: true
        },
        GuardPW: {
            type: String
        },
        UserType: {
            type: String,
        },
        GaurdName: {
            type: String,
        },
        GuardPhone: {
            type: String,
        },
        RelationshipWithSilver:{
            type: String,
        },
        SilverID: {
            type: String,
        },
        SilverPW: {
            type: String,
        },
        Notice_hasCompleted: {
            type: String
        },
        Notice_ifNon: {
            type: String
        }
    },
    Notice_hasCompleted: {
        type: Boolean
    },
    Notice_ifNon: {
        type: Boolean
    }
});

module.exports = User = mongoose.model("Users", UserSchema, "Users")