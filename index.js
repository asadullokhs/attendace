const express = require("express");
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const cors = require("cors");

const userRouter = require("./src/Router/userRouter")
const groupRouter = require("./src/Router/groupRouter")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

//middlewear
app.use(fileupload({ useTempFiles: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", userRouter);
app.use("/group", groupRouter);

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server responded at ${PORT} PORT...`);
    });
  })
  .catch((error) => console.log(error));
