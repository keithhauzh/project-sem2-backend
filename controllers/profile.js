const User = require("../models/user");

const getProfile = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    console.log(id);
    throw new Error("User does not exist");
  }
  const userData = {
    name: user.name,
    email: user.email,
    title: user.specialTitle,
    color: user.premium_color,
  };
  return userData;
};

const getSelfProfile = async (user) => {
  const selectedUser = await User.findById(user);
  return selectedUser;
};

const editProfile = async (name, title = "", color, user) => {
  const editedProfile = await User.findByIdAndUpdate(
    user,
    {
      name,
      specialTitle: title,
      premium_color: color,
    },
    { new: true }
  );
  return editedProfile;
};

module.exports = { getProfile, getSelfProfile, editProfile };
