const express = require("express");
const router = express.Router();

const { getUsers, deleteUser } = require("../controllers/admin");
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


// get one user

// delete user
router.get("/:id", isAdmin, async (req, res) => {
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

// edit user



module.exports = router;
