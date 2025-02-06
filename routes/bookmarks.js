const express = require("express");
const router = express.Router();

const { getBookmarkedPosts } = require("../controllers/bookmarks");
const { findUserIdFromToken, isValidUser } = require("../middleware/auth");

router.get("/", isValidUser, async (req, res) => {
  try {
    const user = await findUserIdFromToken(req);
    const interest = req.query.interest;
    const page = req.query.page;
    console.log(user._id);
    const posts = await getBookmarkedPosts(user, interest, page);
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
