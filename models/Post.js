const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    image_path: {
        type: String,
        required: true,
    },
    body : {
        type: String,
        required: true,
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
    },
    date: {
        type: Date,
    },
});
module.exports = mongoose.model("Post", PostSchema);
