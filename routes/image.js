const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const { addNewImage, getImages, likeImage } = require("../controllers/image");
const { findUserIdFromToken, isValidUser } = require("../middleware/auth");

const upload = multer({ storage: storage });

// save raw image
router.post("/newImage", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }
    const image_url = req.file.path;
    // console.log("Uploaded file:", req.file);
    res.status(200).send({ image_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(400).send({ message: error.message });
  }
});

// post image doc
router.post("/", async (req, res) => {
  try {
    const image = req.body.image;
    if (!image) {
      return res.status(400).send({ error: "Required data is missing :(" });
    } else {
      const newImage = await addNewImage(image);
      res.status(200).send(newImage);
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// get all images
router.get("/", async (req, res) => {
  try {
    const page = req.query.page;
    const images = await getImages(page);
    res.status(200).send(images);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// like image
router.put("/", isValidUser, async (req, res) => {
  try {
    const id = req.body.id;
    const user = await findUserIdFromToken(req);
    const trueOrFalse = await likeImage(id, user);
    res.status(200).send(trueOrFalse);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
