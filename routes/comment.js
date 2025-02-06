const express = require("express");
const router = express.Router();
const { getComments, createComment } = require("../controllers/comment");
const { findUserIdFromToken, isValidUser } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const id = req.body.id;
    const comments = await getComments(id);
    res.status(200).send(comments);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/create", isValidUser, async (req, res) => {
  try {
    const id = req.body.id;
    const user = (await findUserIdFromToken(req)).toString();
    // console.log(user);
    // const user = req.body.user;
    const content = req.body.content;
    if (!id || !user || !content) {
      res.status(400).send({ error: "Required data is missing" });
    }
    const newComment = await createComment(id, user, content);
    res.status(200).send({ newComment });
  } catch (error) {
    // console.log(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
