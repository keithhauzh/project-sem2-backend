const Post = require("../models/post");
const Comment = require("../models/comment");

const getComments = async (id) => {
  console.log(id);
  const post = await Post.findById(id).populate("comments");
  return post.comments;
};

const createComment = async (postId, user, content) => {
  console.log(user);
  console.log(content);
  const post = await Post.findById(postId.toString());
  // console.log(post);
  const newComment = new Comment({ user, content });
  // console.log(newComment);
  if (!newComment) {
    throw new Error("Comment Creation was unsuccessful");
  }
  if (newComment) {
    post.comments.push(newComment._id);
    await newComment.save();
    await post.save();
    return post;
  } else {
    throw new Error("Comment Creation was unsuccessful :(");
  }
};

module.exports = { getComments, createComment };
