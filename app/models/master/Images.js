const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const imageSchema = new Schema({
    filename: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },

    orignalName: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }



}, {
    timestamps: true
});



module.exports = Images = mongoose.model("Image", imageSchema);
