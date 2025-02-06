const express = require("express");
const router = express.Router();
const {
  getProfile,
  getSelfProfile,
  editProfile,
} = require("../controllers/profile");
const { isValidUser, findUserIdFromToken } = require("../middleware/auth");

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const profile = await getProfile(id);
    // console.log(profile);
    res.status(200).send(profile);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// get self profile
router.get("/", isValidUser, async (req, res) => {
  try {
    const user = (await findUserIdFromToken(req)).toString();
    // console.log(user.toString());
    const profile = await getSelfProfile(user);
    res.status(200).send(profile);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// edit profile
router.put("/edit", isValidUser, async (req, res) => {
  try {
    const name = req.body.name;
    const title = req.body.title;
    const color = req.body.color;
    const user = (await findUserIdFromToken(req)).toString();
    const editedProfile = await editProfile(name, title, color, user);
    // console.log(editedProfile);
    res.status(200).send(editedProfile);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
