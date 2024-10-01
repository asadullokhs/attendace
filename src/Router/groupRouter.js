const express = require("express");
const router = express.Router();

const groupCtrl = require("../Controller/groupCtrl");
const authMiddlewear = require("../middleware/authMiddlewear");
router.post("/add", authMiddlewear, groupCtrl.addGroup);
router.get("/")

module.exports = router;
