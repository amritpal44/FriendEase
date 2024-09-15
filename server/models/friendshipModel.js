const mongoose = require("mongoose");

//in friendship model: user1 will be the request sender and user2 is the person who received the request
const friendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    }
})

module.exports = mongoose.model("Friendship", friendshipSchema);