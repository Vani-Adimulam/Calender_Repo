const mongoose = require("mongoose")

const SuperuserSchema = mongoose.Schema({
    SuperUsername: {
        type: String,
        required: true,
        validate: {
            validator: function (SuperUsername) {
                return !/\s/.test(SuperUsername);
            },
            message: "Username cannot contain empty spaces"
        }
    },
    SuperUserEmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (SuperUserEmail) {
                // Regular expression to validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(SuperUserEmail);
            },
            message: "Please enter a valid email address"
        }
    },
    SuperUserpassword: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
})


const Superuserdetail = mongoose.model("SuperUser", SuperuserSchema)
module.exports = Superuserdetail;