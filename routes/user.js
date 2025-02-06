const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/user");

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await login(email, password);

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = await signup(name, email, password);

    res.status(200).send(user);
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      error: error.message,
    });
  }
});

module.exports = router;
