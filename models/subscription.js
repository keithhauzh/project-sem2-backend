const { Schema, model } = require("mongoose");

const subscriptionSchema = new Schema({
  memberName: { type: String, required: true },
  memberEmail: { type: String, required: false },
  paidAmount: { type: Number, required: true },
  status: {
    type: String,
    requird: true,
    default: "failed",
    enum: ["paid", "failed"],
  },
  billplz_id: String,
  paid_at: Date,
});

const Subscription = model("Subscription", subscriptionSchema);
module.exports = Subscription;
