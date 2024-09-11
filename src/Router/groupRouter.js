const express = require("express");
const router = express.Router();

const groupCtrl = require("../Controller/groupCtrl");
const authMiddlewear = require("../middleware/authMiddlewear");
router.post("/add", authMiddlewear, groupCtrl.addGroup);

module.exports = router;
