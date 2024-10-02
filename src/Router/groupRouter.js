const express = require("express");
const router = express.Router();

const groupCtrl = require("../Controller/groupCtrl");
const authMiddlewear = require("../middleware/authMiddlewear");
router.post("/add", authMiddlewear, groupCtrl.addGroup);
router.get("/", authMiddlewear, groupCtrl.getAllGroup);
router.get('/:id', groupCtrl.getGroupById);
router.delete("/:id", authMiddlewear, groupCtrl.deleteGroup);
router.put('/:id', authMiddlewear, groupCtrl.updateGroup)

module.exports = router;
