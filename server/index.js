const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path"); // Node.js module for working with file paths
const fs = require("fs"); // Node.js module for file system operations
const PORT = process.env.PORT || 8080;
const URI =
  "mongodb+srv://allblogsdata:%40Hanish870807@cluster0.tdruxdp.mongodb.net/multer?retryWrites=true&w=majority";

app.use(express.json());
app.use(cors());

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images"); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});
const upload = multer({ storage: storage });

// Define the image schema
const imageSchema = new mongoose.Schema({
  imageName: String,
});
const Image = mongoose.model("Image", imageSchema);

// Define route handler for saving image
app.post("/save", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // Create a new image document and save it to the database
    const newImage = new Image({ imageName: req.file.originalname });
    await newImage.save();
    res.send("File uploaded successfully.");
  } catch (error) {
    console.log(error);
    return res.status(400).send("No file uploaded.");
  }
});

// Define route handler for fetching all images
app.get("/images", async (req, res) => {
  try {
    // Fetch all image names from the database
    const images = await Image.find({}, "imageName");
    res.json(images); // Return image names as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Connect to MongoDB and start the server
mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to database.");
      console.log("Server is live on PORT:", PORT);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database.", err);
    process.exit(1);
  });
