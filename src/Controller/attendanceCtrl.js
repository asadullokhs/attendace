const Attendance = require("../Model/attendanceModel");
const Users = require("../Model/userModel");
const Group = require("../Model/groupModel");

const attendanceCtrl = {
  markAttendance: async function (req, res) {
    const { studentId, groupId, status } = req.body;
    const date = new Date().toISOString().split('T')[0]; 

    try {
      if (req.userIsAdmin || req.user.role === 'teacher') {
        if (!studentId || !groupId || !status) {
          return res.status(400).send({ message: "Please fill all the fields" });
        }

        let attendance = await Attendance.findOne({ student: studentId, group: groupId, date });

        if (!attendance) {
          attendance = new Attendance({
            student: studentId,
            group: groupId,
            date,
            status,
          });
        } else {
          attendance.status = status;
        }

        await attendance.save();
        res.status(200).send({ message: "Attendance marked successfully", attendance });
      } else {
        res.status(403).send({ message: "You do not have permission to mark attendance" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  getAttendanceByGroup: async function (req, res) {
    const { groupId } = req.params;
    try {
      if (req.userIsAdmin || req.user.role === 'teacher') {
        const attendanceRecords = await Attendance.find({ group: groupId }).populate("student");
        res.status(200).send({ message: "Attendance records for group", attendance: attendanceRecords });
      } else {
        res.status(403).send({ message: "You do not have permission to view attendance" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  getAttendanceByStudent: async function (req, res) {
    const { studentId } = req.params;
    try {
      if (req.userIsAdmin || req.user.role === 'teacher' || req.user._id === studentId) {
        const attendanceRecords = await Attendance.find({ student: studentId }).populate("group");
        res.status(200).send({ message: "Attendance records for student", attendance: attendanceRecords });
      } else {
        res.status(403).send({ message: "You do not have permission to view attendance" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  deleteAttendance: async function (req, res) {
    const { id } = req.params;
    try {
      if (req.userIsAdmin) {
        const deleteAttendance = await Attendance.findByIdAndDelete(id);
        if (deleteAttendance) {
          return res.status(200).send({ message: "Attendance record deleted successfully" });
        }
        res.status(404).send({ message: "Attendance record not found" });
      } else {
        res.status(403).send({ message: "You do not have permission to delete attendance" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  updateAttendance: async function (req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      if (req.userIsAdmin) {
        const updatedAttendance = await Attendance.findByIdAndUpdate(id, { status }, { new: true });
        if (updatedAttendance) {
          return res.status(200).send({ message: "Attendance record updated successfully", attendance: updatedAttendance });
        }
        res.status(404).send({ message: "Attendance record not found" });
      } else {
        res.status(403).send({ message: "You do not have permission to update attendance" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = attendanceCtrl;