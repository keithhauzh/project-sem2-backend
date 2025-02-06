const Interest = require("../models/interest");

const getInterests = async () => {
  const interests = await Interest.find();
  return interests;
};

const getInterest = async (id) => {
  const interest = await Interest.findOne({ _id: id });
  return interest;
};

const addInterest = async (name) => {
  const newInterest = new Interest({
    name,
  });
  await newInterest.save();
  return newInterest;
};

const deleteInterest = async (_id) => {
  const deleteCategory = await Category.deleteOne({ _id });
  return deleteCategory;
};

module.exports = {
  getInterests,
  getInterest,
  addInterest,
  deleteInterest,
};
