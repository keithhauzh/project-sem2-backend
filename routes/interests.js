const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// const { isAdmin } = require("../middleware/auth");

const {
  getInterests,
  getInterest,
  addInterest,
  deleteInterest,
} = require("../controllers/interest");

// get interests
router.get("/", async (req, res) => {
  try {
    const interests = await getInterests();
    res.status(200).json(interests);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: "Error fetching category: " + error.message });
  }
});

// get interest
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const interest = await getInterest(id);
    if (interest) {
      res.status(200).send(interest);
    } else {
      res.status(400).send("Interest not found");
    }
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// add interest
router.post(
  "/",
  /*isAdmin,*/ async (req, res) => {
    try {
      const name = req.body.name;
      if (!name) {
        return res.status(400).send({
          error: "Error:Error",
        });
      }
      const newInterest = await addInterest(name);
      res.status(200).send(newInterest);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: error._message,
      });
    }
  }
);

// delete interest
router.delete(
  "/:id",
  /*isAdmin, */ async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
        });
      }
      const interest = await getInterest(id);
      if (!interest) {
        return res.status(404).send({
          error: `Error: No match for an interest found with the id "${id}".`,
        });
      }
      const status = await deleteInterest(id);
      res.status(200).send({
        message: `Alert:Interest with the provided id #${id} has been deleted`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: error._message,
      });
    }
  }
);

module.exports = router;
