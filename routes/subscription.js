const express = require("express");

const router = express.Router();

// const {isValidUser,isAdmin,isPremium} = require("../middleware/auth");

const {
  getSubscriptions,
  createSubscription,
  deleteSubscription,
  verifyPayment,
} = require("../controllers/subscription");

const { isValidUser, findUserIdFromToken } = require("../middleware/auth");

// get subscriptions
router.get(
  "/",
  /* isAdmin, */ async (req, res) => {
    try {
      const email = req.user.email;
      const role = req.user.role;
      const subscriptions = await getSubscriptions(email, role);
      res.status(200).send(subscriptions);
    } catch (error) {
      res.status(400).send({
        error: error._message,
      });
    }
  }
);

// create subscription
router.post("/", isValidUser, async (req, res) => {
  try {
    const currentUser = await findUserIdFromToken(req);
    const { memberName, memberEmail, title = "", color } = req.body;
    const newSubscription = await createSubscription(
      memberName,
      memberEmail,
      title,
      color,
      currentUser
    );
    res.status(200).send(newSubscription);
  } catch (error) {
    // console.log(error.response.data.error);
    // console.log(error);
    res.status(400).send({
      error: error._message,
    });
  }
});

// verify payment
router.post("/verify-payment", async (req, res) => {
  try {
    const { billplz_id, billplz_paid, billplz_paid_at, billplz_x_signature } =
      req.body;

    const updatedSubscription = await verifyPayment(
      billplz_id,
      billplz_paid,
      billplz_paid_at,
      billplz_x_signature
    );
    res.status(200).send(updatedSubscription);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error.message,
    });
  }
});

// delete subscription
router.delete(
  ":/id",
  /* isAdmin, */ async (req, res) => {
    try {
      const id = req.params.id;
      await deleteSubscription(id);
      res.status(200).send({
        message: `Subscription with the provided id #${id} has been deleted`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error._message });
    }
  }
);

module.exports = router;
