const express = require("express");
const router = express.Router();

const userCtrl = require("../Controller/userCtrl");
const authMiddlewear = require("../middleware/authMiddlewear");
router.post("/add", authMiddlewear, userCtrl.addUser);
router.post("/login", userCtrl.login);

module.exports = router;
