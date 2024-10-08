const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
    },
    hobbies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hobby",
        }
    ],
    bio: {
        type: String,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    potentialFriends: [
        {
            friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Store the user ID
            mutualFriendsCount: { type: Number, default: 0 }
        }
    ],
    friendRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Friendship",
        }
    ]
})

module.exports = mongoose.model("User", userSchema);