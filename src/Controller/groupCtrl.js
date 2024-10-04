const Group = require("../Model/groupModel");
const Users = require("../Model/userModel");
const mongoose = require("mongoose");


const groupCtrl = {
  // Add group and initialize attendance for all users in that group
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

        res.status(200).send({
          message: "New group added successfully.",
          newGroup,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // Get all groups
  getAllGroup: async function (req, res) {
    try {
      if (req.userIsAdmin || req.user.role === 'teacher') {
        const group = await Group.find();
        res.status(200).send({ message: "All groups", groups: group });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // Delete group and associated users
  deleteGroup: async function (req, res) {
    const { id } = req.params;
    try {
      if (req.userIsAdmin) {
        const deleteGroup = await Group.findByIdAndDelete(id);
        if (deleteGroup) {
          await Users.deleteMany({ group: id });
          return res.status(200).send({
            message: `Group deleted successfully`,
          });
        }
        res.status(404).send({ message: "Group not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // Update group details
  updateGroup: async function (req, res) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      if (req.userIsAdmin || req.user.role === "teacher") {
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
          .send({ message: "Group updated successfully", group: updatedGroup });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // Get group by ID with users and their attendance
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
                    { $match: { $expr: { $eq: ["$student", "$$userId"] } } },
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
