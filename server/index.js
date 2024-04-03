const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path"); // Node.js module for working with file paths
const fs = require("fs"); // Node.js module for file system operations
const PORT = process.env.PORT || 8080;
const URI = "mongodb+srv://allblogsdata:%40Hanish870807@cluster0.tdruxdp.mongodb.net/multer?retryWrites=true&w=majority";

app.use(express.json());
app.use(cors())

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images'); // Specify the destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("<h1>Server is running....</h1>");
});

// Define route handler for saving image
app.post("/save", upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        res.send('File uploaded successfully.');
    } catch (error) {
        console.log(error);
        return res.status(400).send('No file uploaded.');

    }

});

// Connect to MongoDB and start the server
mongoose.connect(URI)
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
