const express = require("express");
const router = express.Router();

const {
  getUsers,
  deleteUser,
  createInterest,
  deleteInterest,
  deletePost,
} = require("../controllers/admin");
const { isAdmin } = require("../middleware/auth");

// get users
router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// delete user
router.delete("/user/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await deleteUser(id);
    res.status(200).send({
      message: `User with the provided id#${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// delete a post
router.delete("/post/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await deletePost(id);
    res.status(200).send({
      message: `Post with the provided id#${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// add an interest
router.post("/interest", isAdmin, async (req, res) => {
  try {
    const interestName = req.body.interestName;
    const newInterest = await createInterest(interestName);
    // console.log(newInterest);
    res.status(200).send(newInterest);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// delete an interest
router.delete("/interest/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await deleteInterest(id);
    res.status(200).send({
      message: `Interest with the provided id#${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
