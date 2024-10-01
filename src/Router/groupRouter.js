const express = require("express");
const router = express.Router();

const groupCtrl = require("../Controller/groupCtrl");
const authMiddlewear = require("../middleware/authMiddlewear");
router.post("/add", authMiddlewear, groupCtrl.addGroup);
router.get("/", groupCtrl.getAllGroup);
router.get('/:id', groupCtrl.getGroupById);
router.delete("/:id", groupCtrl.deleteGroup);
router.put('/:id', groupCtrl.updateGroup)

module.exports = router;
