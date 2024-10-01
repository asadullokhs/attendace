const express = require("express");
const router = express.Router();

const userCtrl = require("../Controller/userCtrl");
const authMiddlewear = require("../middleware/authMiddlewear");
router.post("/add", authMiddlewear, userCtrl.addUser);
router.post("/login", userCtrl.login);
router.get("/", userCtrl.getAllUsers);
router.get('/:id', userCtrl.getUser)
router.put('/:id', userCtrl.updateUser)
router.delete('/:id', userCtrl.deleteUser)

module.exports = router;
