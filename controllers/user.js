const User = require("../models/user");

// jwt token import
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

async function getUserByEmail(email) {
  return await User.findOne({ email });
}

async function getUserById(_id) {
  return await User.findOne({ _id });
}

function generateJWTtoken(_id, name, email, role, premium_id = "") {
  return jwt.sign(
    { _id, name, email, role, premium_id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

const login = async (email, password) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const inPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!inPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateJWTtoken(
    user._id,
    user.name,
    user.email,
    user.role,
    user.premium_id
  );

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    premium_id: user.premium_id,
    token,
  };
};

const signup = async (name, email, password) => {
  const emailExists = await User.findOne({
    email,
  });

  if (emailExists) {
    throw new Error("Email already exists");
  }

  const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  });

  await newUser.save();

  const token = generateJWTtoken(
    newUser._id,
    newUser.name,
    newUser.email,
    newUser.role
  );

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token,
  };
};

module.exports = { login, signup, getUserByEmail, getUserById };
