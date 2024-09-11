
const Group = require("../Model/groupModel");

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
};

module.exports = groupCtrl;
