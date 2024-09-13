
const Group = require("../Model/groupModel");
const Users = require("../Model/userModel")

const groupCtrl = {
    addGroup: async function (req, res) {
        const { name, weekDay } = req.body;
        try {
          if (req.userIsAdmin) {
            if (!name || !weekDay) {
              return res.status(403).send({ message: "Plase fill all the fields" });
            }
    
            const oldGroup = await Group.findOne({ name });
            if (oldGroup) {
              return res.status(400).send({
                message: `Group named as ${oldGroup.name} already exists`,
              });
            }
    
            const newGroup = new Group({ name, weekDay });
    
            await newGroup.save();
            res.status(200).send({ message: "New group added successfuly", newGroup });
          }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: error.message });
        }
      },
      getAllGroup: async function (req, res) {
        try {
          if ((req.userIsAdmin)) {
            const group = await Group.find();
            res.status(200).send({ message: "All groups", gropus: group });
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
};

module.exports = groupCtrl;
