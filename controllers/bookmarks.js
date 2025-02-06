const mongoose = require("mongoose");
const Post = require("../models/post");

const getBookmarkedPosts = async (user, interest, page, per_page = 5) => {
  const ifBookmarksExists = await Post.find({
    bookmarks: user,
  });

  let filter = { bookmarks: user };
  if (interest && interest !== "all") {
    filter.interest = interest;
  }

  //   console.log(user._id);

  // console.log(ifBookmarksExists);
  if (!ifBookmarksExists.length > 0) {
    throw new Error("No bookmarks for this user");
  }

  const posts = await Post.find(filter)
    .populate("interest")
    .populate("user")
    .populate("likes", "_id")
    .populate("bookmarks", "_id")
    .limit(per_page)
    .skip((page - 1) * per_page)
    .sort({ _id: -1 });
  return posts;
};

module.exports = {
  getBookmarkedPosts,
};
