
const Group = require("../Model/groupModel");
const Users = require("../Model/userModel")
const Attendance = require("../Model/attendanceModel")
const mongoose = require("mongoose")

const getCurrentMonthDates = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const dates = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day)); // Create date objects
  }

  return dates;
};


const groupCtrl = {
  addGroup: async function (req, res) {
    const { name, weekDay } = req.body;
    try {
      if (req.userIsAdmin) {
        if (!name || !weekDay) {
          return res.status(403).send({ message: "Please fill all the fields" });
        }

        const oldGroup = await Group.findOne({ name });
        if (oldGroup) {
          return res.status(400).send({
            message: `Group named as ${oldGroup.name} already exists`,
          });
        }

        const newGroup = new Group({ name, weekDay });
        await newGroup.save();

        const students = await Users.find({ group: newGroup._id });
        const dates = getCurrentMonthDates();

        for (let student of students) {
          for (let date of dates) {
            const attendance = new Attendance({
              student: student._id,
              group: newGroup._id,
              date: date,
              status: "not marked", 
            });
            await attendance.save();
          }
        }

        res.status(200).send({
          message: "New group added successfully, and attendance initialized.",
          newGroup,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

      getAllGroup: async function (req, res) {
        try {
          if ((req.userIsAdmin || req.user.role === 'teacher')) {
            const group = await Group.find();
            res.status(200).send({ message: "All groups", groups: group });
          }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: error.message });
        }
      },

      deleteGroup: async function (req, res) {
        const { id } = req.params;
        try {
          if (req.userIsAdmin) {
            const deleteGroup = await Group.findByIdAndDelete(id);
            if (deleteGroup) {
              await Users.deleteMany({ group: id });
              return res.status(200).send({
                message: `Group deleted successfuly`,
              });
            }
            res.status(404).send({ message: "Group not found" });
          }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: error.message });
        }
      },

      updateGroup: async function (req, res) {
        const { id } = req.params;
        const { name } = req.body;
        try {
          if ((req.userIsAdmin || req.user.role === "teacher")) {
            const oldGroup = await Group.findOne({ name });
            if (oldGroup) {
              return res.status(400).send({
                message: `Group named as ${oldGroup.name} already exists`,
              });
            }
    
            const updatedGroup = await Group.findByIdAndUpdate(id, req.body, {
              new: true,
            });
            return res
              .status(200)
              .send({ message: "Group updated successfuly", group: updatedGroup });
          }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: error.message });
        }
      },
  getGroupById: async (req, res) => {
    const { id } = req.params;
    try {
      const group = await Group.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "users",
            let: { group: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$group", "$$group"] } } },
              {
                $lookup: {
                  from: "attendances",
                  let: { userId: "$_id" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
                  ],
                  as: "attendanceRecords",
                },
              },
            ],
            as: "users",
          },
        },
      ]);

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      res.status(200).json({ message: "One group", group });
    } catch (error) {
      console.log(error);
      res.status(503).json(error.message);
    }
  },

};

module.exports = groupCtrl;
