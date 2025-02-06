const Post = require("../models/post");
const User = require("../models/user");

const getUsers = async () => {
  const users = await User.find();
  return users;
};

const deleteUser = async (id) => {
  console.log(id);
  const usersposts = await Post.findByIdAndDelete({ user: id });
  if (usersposts) {
    return await User.findByIdAndDelete(id);
  } else {
    throw new Error("Unsuccessful deletion");
  }
};

module.exports = { getUsers, deleteUser };
