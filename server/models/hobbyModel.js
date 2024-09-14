const mongoose = require("mongoose");

const hobbySchema = new mongoose.Schema({
    hobby: {
        type: String,
        required: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]
})

module.exports = mongoose.model("Hobby", hobbySchema);