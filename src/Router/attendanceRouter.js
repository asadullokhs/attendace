const express = require("express");
const router = express.Router();
const attendanceCtrl = require("../Controller/attendanceCtrl");
const authMiddlewear = require("../middleware/authMiddlewear");
router.post("/mark", authMiddlewear, attendanceCtrl.markAttendance);

router.get(
  "/group/:groupId",
  authMiddlewear,
  attendanceCtrl.getAttendanceByGroup
);

router.get(
  "/student/:studentId",
  authMiddlewear,
  attendanceCtrl.getAttendanceByStudent
);

router.delete("/:id", authMiddlewear, attendanceCtrl.deleteAttendance);

router.put("/:id", authMiddlewear, attendanceCtrl.updateAttendance);

module.exports = router;
