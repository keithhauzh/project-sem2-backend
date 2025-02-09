const { findUserIdFromToken } = require("../middleware/auth");
const Image = require("../models/image");
const Post = require("../models/post");
const User = require("../models/user");

const addNewImage = async (image) => {
  const newImage = new Image({
    image,
  });
  await newImage.save();
  return newImage;
};

const getImages = async (page, per_page = 5) => {
  const images = await Image.find()
    .populate("likes", "_id")
    .limit(per_page)
    .skip((page - 1) * per_page)
    .sort({ _id: -1 });
  return images;
};
const likeImage = async (id, user) => {
  const image = await Image.findById(id);
  if (!image) {
    throw new Error("Image not found :(");
  }
  const userId = user._id.toString();
  const likesArray = image.likes.map((like) => like.toString());
  if (likesArray.includes(userId)) {
    image.likes = image.likes.filter(
      (currentUserId) => currentUserId.toString() !== userId
    );
    await image.save();
    return false;
  } else {
    image.likes.push(user._id);
    await image.save();
    return true;
  }
};

module.exports = {
  addNewImage,
  getImages,
  likeImage,
};
