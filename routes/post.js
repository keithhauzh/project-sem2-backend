const express = require("express");
const router = express.Router();
// const {isAdmin} = require("../middleware/auth")
const {
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  likePost,
  bookmarkPost,
} = require("../controllers/post");
const {
  isValidUser,
  findUserIdFromToken,
  isPremium,
} = require("../middleware/auth");

// get posts
router.get("/", async (req, res) => {
  try {
    const interest = req.query.interest;
    const page = req.query.page;
    const posts = await getPosts(interest, page);
    res.status(200).send(posts);
  } catch (error) {
    // console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// get one post
router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await getPost(id);
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(400).send("Post not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error.message,
    });
  }
});

// add post
router.post("/", isValidUser, async (req, res) => {
  try {
    const user = req.body.user;
    const title = req.body.title;
    const content = req.body.content;
    const interest = req.body.interest;

    if (!user || !title || !content || !interest) {
      {
        return res.status(400).send({ error: "Required data is missing" });
      }
    }
    const newPost = await addPost(user, title, content, interest);
    res.status(200).send(newPost);
  } catch (error) {
    // console.log(error)
    res.status(400).send({
      error: error.message,
    });
  }
});

// edit post
router.put("/edit/:id", isPremium, async (req, res) => {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    const interest = req.body.interest;
    const editedPost = await editPost(id, title, content, interest);
    console.log(editedPost);
    res.status(200).send(editedPost);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// delete post
router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const id = req.params.id;
    const loggedUserId = await findUserIdFromToken(req);
    await deletePost(id, loggedUserId);
    res.status(200).send({
      message: `Post with the provided id#${id} has been deleted`,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

// like and unlike post
router.put("/:id/like", isValidUser, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await findUserIdFromToken(req);
    const updatedPost = await likePost(id, user);
    res.status(200).send(updatedPost);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// bookmark and unbookmark post
router.put("/:id/bookmark", isValidUser, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await findUserIdFromToken(req);
    const updatedPost = await bookmarkPost(id, user);
    res.status(200).send(updatedPost);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
