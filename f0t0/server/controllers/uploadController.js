//Connect to DB
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const express = require("express");
const app = express();
const crypto = require("crypto");
const Grid = require("gridfs-stream");
const config = require("../../config.json");
const Photo = require("../models/Photo");
const User = require("../models/User");
const path = require("path");

//Create collection
const conn = mongoose.createConnection(config.mongoURI);
let gfs;

conn.once("open", () => {
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: config.mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        // const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("img"), (req, res, err) => {
  console.log("file", req.body);
  res.json({ file: req.file });
});

app.get("/upload", (req, res) => {
  const user = req.session.user;
  // delete user.password;
  res.json({ status: "upload page", user });
});

app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }
    return res.json(files);
  });
});

app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    return res.json(file);
  });
});

app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

app.post("/photo", (req, res) => {
  const newPhoto = new Photo({
    id: req.body.id,
    chunkSize: req.body.chunkSize,
    uploadDate: req.body.uploadDate,
    filename: req.body.filename,
    md5: req.body.md5,
    contentType: req.body.contentType,
    caption: req.body.caption,
    tags: req.body.tags,
  });

  res.setHeader("Content-Type", "application/json");
  newPhoto.save(function (err) {
    if (err) {
      var error = "Oops something bad happened! Try again";
      res.status(400).send(error);
    } else {
      User.findOne({ email: req.session.user.email }, function (err, user) {
        if (err) {
          return res.status(400).json({ err: "Bad request" });
        }
        const images = user.images;
        images.push(req.body.filename);
        User.findOneAndUpdate({ email: user.email }, { images }, function (
          err,
          updatedUser
        ) {
          if (err) {
            return res.status(400).json({ err: "Bad request" });
          }
          error = "successfully saved photo!";
          return res.status(200).send(updatedUser);
        });
      });
    }
  });
});

app.get("/photos", (req, res) => {
  Photo.find({}, function (err, photos) {
    if (err) {
      return res.status(404).json({ err });
    }
    return res.json(photos);
  });
});

app.get("/images/my-images", (req, res) => {
  User.findOne({ email: req.session.user.email }, function (err, user) {
    if (err) {
      return res.status(400).json({ err: "Bad request" });
    }
    console.log("user images", user.images);
    return res.status(200).json({
      userImages: user.images,
    });
  });
});

module.exports = app;
