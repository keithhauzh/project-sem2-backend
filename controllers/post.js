const Post = require("../models/post");
const User = require("../models/user");

const getPosts = async (interest, page = 1, per_page = 5) => {
  let filter = {};
  if (interest && interest !== "all") {
    filter.interest = interest;
  }
  // console.log(interest);
  const posts = await Post.find(filter)
    .populate("interest")
    .populate("user")
    .populate("likes", "_id")
    .populate("bookmarks", "_id")
    .populate("comments")
    .limit(per_page)
    .skip((page - 1) * per_page)
    .sort({ _id: -1 });
  return posts;
};

const getPost = async (id) => {
  // console.log(id);
  const post = await Post.findById(id)
    .populate("user")
    .populate("comments")
    .populate("interest");
  // console.log(post);
  return post;
};

const addPost = async (user, title, content, interest) => {
  try {
    const newPost = new Post({ user, title, content, interest });
    await newPost.save();

    const userId = await User.findById(user);

    if (!userId) {
      throw new Error("User not found :(");
    }

    if (userId.posts.includes(newPost._id)) {
      throw new Error("Post_id already added to user!");
    }

    userId.posts.push(newPost._id);
    await userId.save();

    return newPost;
  } catch (error) {
    console.error("Error adding post:", error.message);
    throw new Error(error.message);
  }
};

const editPost = async (id, title, content, interest) => {
  const editedPost = await Post.findByIdAndUpdate(
    id,
    {
      title,
      content,
      interest,
    },
    { new: true }
  );
  return editedPost;
};

const deletePost = async (id, loggedUserId) => {
  const post = await Post.findById(id);
  const profile = await User.findById(post.user);

  if (!post) {
    throw new Error("This post does not exist");
  }

  if (loggedUserId.toString() !== post.user.toString()) {
    throw new Error("This post does not belong to you!");
    // console.log(loggedUserId);
    // console.log(post.user);
  }

  if (!profile) {
    throw new Error("User not found :(");
  }

  if (profile.posts.includes(id)) {
    profile.posts.filter((post) => {
      post !== id;
    });
    await profile.save();
    return await Post.findByIdAndDelete(id);
  } else {
    throw new Error("Post was not found :(");
  }
};

const likePost = async (id, user) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found :(");
  }
  if (post.likes.includes(user)) {
    post.likes = post.likes.filter((userId) => {
      userId !== user;
    });
  } else {
    post.likes.push(user);
  }
  await post.save();
  return post;
};

const bookmarkPost = async (id, user) => {
  const post = await Post.findById(id);
  const profile = await User.findById(user);
  if (!post) {
    throw new Error("Post not found :(");
  }
  if (!profile) {
    throw new Error("User not logged in :(");
  }
  if (post.bookmarks.includes(user) && profile.bookmarks.includes(id)) {
    post.bookmarks = post.bookmarks.filter((userId) => {
      userId !== user;
    });
    profile.bookmarks = profile.bookmarks.filter((postId) => {
      postId !== id;
    });
  } else {
    post.bookmarks.push(user);
    profile.bookmarks.push(id);
  }
  await post.save();
  await profile.save();
  return post;
};

module.exports = {
  getPosts,
  getPost,
  editPost,
  addPost,
  deletePost,
  likePost,
  bookmarkPost,
};
