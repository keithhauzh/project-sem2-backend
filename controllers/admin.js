const Post = require("../models/post");
const User = require("../models/user");
const Interest = require("../models/interest");

const getUsers = async () => {
  const users = await User.find();
  return users;
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found!");
  } else {
    return await User.findByIdAndDelete(id);
  }
};

const deletePost = async (id) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("This post does not exist");
  } else {
    return await Post.findByIdAndDelete(id);
  }
};

const createInterest = async (name) => {
  // console.log(name);
  const newInterest = new Interest({ name });
  if (newInterest) {
    await newInterest.save();
    return newInterest;
  } else {
    throw new Error("Interest Creation was unsuccessful :(");
  }
};

const deleteInterest = async (id) => {
  const interest = await Interest.findById(id);
  const deleted = await Interest.findByIdAndDelete(id);
  if (!interest) {
    throw new Error("This interest does not exist!");
  }
  if (!deleted) {
    throw new Error("Interest deletion was not successful");
  }
  return deleted;
};

module.exports = {
  getUsers,
  deleteUser,
  createInterest,
  deleteInterest,
  deletePost,
};
