const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: function (username) {
                return !/\s/.test(username);
            },
            message: "Username cannot contain empty spaces"
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                // Regular expression to validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: "Please enter a valid email address"
        }
    },
    password: {
        type: String,
        required: true
    },
    isSuperUser: {
        type: Boolean,
        default: false,
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


const userdetail = mongoose.model("User", userSchema)
module.exports = userdetail;