const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  image: String,
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Image = model("Image", imageSchema);

module.exports = Image;
