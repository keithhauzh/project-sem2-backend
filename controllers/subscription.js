// require axios to call billplz api
const axios = require("axios");
const { createHmac } = require("crypto");

const Subscription = require("../models/subscription");
const Post = require("../models/post");
const User = require("../models/user");

async function generateId() {
  const { nanoid } = await import("nanoid");
  return nanoid();
}

// get all subscriptions
const getSubscriptions = async (email, role) => {
  let filter = {};
  if (role !== "admin") {
    filter.memberEmail = email;
  }
  const subscriptions = await Subscription.find(filter).sort({ _id: -1 });
  return subscriptions;
};

// get one subscription
const getOneSubscription = async (_id) => {};

const createSubscription = async (
  memberName,
  memberEmail,
  title,
  color,
  currentUser,
  paidAmount = 20
) => {
  // console.log(currentUser._id.toString());
  const payingUser = await User.findById(currentUser._id.toString());
  // console.log(payingUser.email);
  // console.log(memberEmail);
  if (payingUser.email !== memberEmail) {
    throw new Error("Authentication Failed. Please try again..");
    // console.log("Failed la");
  } else {
    const billplzResponse = await axios.post(
      "https://www.billplz-sandbox.com/api/v3/bills",
      {
        collection_id: process.env.BILLPLZ_COLLECTION_ID,
        description: "Payment for Subscriptions",
        name: memberName,
        email: memberEmail,
        amount: parseFloat(paidAmount) * 100,
        callback_url: process.env.FRONTEND_URL + "/verify-payment",
        redirect_url: process.env.FRONTEND_URL + "/verify-payment",
      },
      {
        auth: {
          username: process.env.BILLPLZ_SECRET_KEY,
          password: "",
        },
      }
    );
    const billplz_id = billplzResponse.data.id;
    const billplz_url = billplzResponse.data.url;
    if (billplzResponse) {
      // console.log(billplzResponse, billplz_url, billplz_id);
      const newSubscription = new Subscription({
        memberName,
        memberEmail,
        paidAmount,
        billplz_id,
      });
      // console.log(paidAmount);
      payingUser.premium_id = (await generateId()).toString();
      payingUser.premium_color = color;
      payingUser.specialTitle = title;

      await payingUser.save();
      await newSubscription.save();
      return {
        ...newSubscription,
        billplz_url,
      };
    } else {
      throw new Error("Payment Failed, please try again");
    }
  }
};

const verifyPayment = async (
  billplz_id,
  billplz_paid,
  billplz_paid_at,
  billplz_x_signature
) => {
  // verify x-signature
  const billplz_string = `billplzid${billplz_id}|billplzpaid_at${billplz_paid_at}|billplzpaid${billplz_paid}`;

  // sha256 is the formula
  const x_signature = createHmac("sha256", process.env.BILLPLZ_XSIGNATURE_KEY)
    .update(billplz_string)
    .digest("hex"); //needs to be hex format

  // compare the x signature we created using the encryption formula with billplz x-signature
  if (x_signature !== billplz_x_signature) {
    throw new Error("Signature not valid");
  } else {
    // if both x-signatures match, update the order status
    // find the order using the billplz_id
    const selectedSubscription = await Subscription.findOne({
      billplz_id: billplz_id,
    });

    // check if subscription exists
    if (!selectedSubscription) {
      throw new Error("Subscription not found");
    } else {
      // if subscription is found, update the subscription
      selectedSubscription;
      // if billplz_paid is equal to true, then payment is successful (true is returned as a string, not a boolean value)
      if (billplz_paid === "true") {
        selectedSubscription.status = "paid";
        selectedSubscription.paid_at = billplz_paid_at;
      } else {
        selectedSubscription.status = "failed";
      }

      // save the order to update
      await selectedSubscription.save();
      return selectedSubscription;
    }
  }
};

// delete subscription
const deleteSubscription = async (id) => {
  return await Subscription.findByIdAndDelete(id);
};

module.exports = {
  verifyPayment,
  getSubscriptions,
  getOneSubscription,
  createSubscription,
  deleteSubscription,
};
