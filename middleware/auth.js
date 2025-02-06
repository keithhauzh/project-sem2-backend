const jwt = require("jsonwebtoken");
const { getUserByEmail, getUserById } = require("../controllers/user");
const Post = require("../models/post");

const isValidUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserByEmail(decoded.email);

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).send({ error: "YOU SHALL NOT PASS!" });
    }
  } catch (error) {
    res.status(400).send({ error: "YOU SHALL NOT PASS!" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserByEmail(decoded.email);

    if (user && user.role === "admin") {
      req.user = user;
      next();
    } else {
      res.status(400).send({ error: "YOU SHALL NOT PASS!" });
    }
  } catch (error) {
    res.status(400).send({ error: "YOU SHALL NOT PASS!" });
  }
};

const findUserIdFromToken = async (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded._id) {
      throw new Error("Invalid token: No user ID found");
    }

    const user = await getUserById(decoded._id);
    if (!user) {
      throw new Error("User not found");
    }

    return user._id;
  } catch (error) {
    console.error("Error finding user ID from token:", error.message);
    throw new Error("No user ID found");
  }
};

const isPremium = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.premium_id) {
      next();
    } else {
      res.status(400).send({ error: "YOU ARE NOT A PREMIUM USER! >:(" });
    }
  } catch (error) {
    res.status(400).send({ error: "YOU SHALL NOT PASS!" });
  }
};

module.exports = {
  isValidUser,
  isAdmin,
  findUserIdFromToken,
  isPremium,
};
