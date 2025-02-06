require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(cors());
// app.use("/api/uploads", express.status("uploads"));

mongoose
  .connect(process.env.MONGODB_URL + "/buzzboard")
  .then(() => {
    console.log("MongoDB is connected");
})
  .catch((error) => {
    console.log(error);
  });

app.get("/api", (req, res) => {
  res.send("Happy Coding!");
});

app.use("/api/auth", require("./routes/user"));
app.use("/api/posts", require("./routes/post"));
app.use("/api/interests", require("./routes/interests"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/bookmarks", require("./routes/bookmarks"));
app.use("/api/subscriptions", require("./routes/subscription"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/comments", require("./routes/comment"));

app.listen(5555, () => {
  console.log("Server is running at http://localhost:5555");
});
