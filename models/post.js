const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  interest: { type: Schema.Types.ObjectId, ref: "Interest", required: false },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Post = model("Post", postSchema);

module.exports = Post;
