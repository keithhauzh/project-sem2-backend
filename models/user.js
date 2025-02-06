const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  specialTitle: { type: String, required: false },
  premium_id: { type: String, required: false },
  premium_color: {
    type: String,
    enum: ["none", "pink", "gold", "red"],
    default: "none",
  },
});

const User = model("User", userSchema);

module.exports = User;
