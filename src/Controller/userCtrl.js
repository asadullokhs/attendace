const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "ota_maxf1y";
const Users = require("../Model/userModel");

const userCtrl = {
  addUser: async (req, res) => {
    const { email } = req.body;
    try {
      const existingUser = await Users.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists!" });

      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      req.body.password = hashedPassword;

      if (req.user.role === "teacher" || req.userIsAdmin) {
        const user = new Users(req.body);

        await user.save();
        const { password, ...otherDetails } = user._doc;
        const token = jwt.sign(
          { email: user.email, id: user._id, role: user.role },
          JWT_SECRET
        );
        res.status(201).json({ user: otherDetails, token });
      } else {
        res.status(405).json({ message: "Not allowed" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    const { email } = req.body;
    try {
      const existingUser = await Users.findOne({ email });
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: "Email or password is incorrect!" });
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );

      if (!isPasswordCorrect) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect!" });
      }

      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser._id,
          role: existingUser.role,
        },
        JWT_SECRET
      );
      const { password, ...otherDetails } = existingUser._doc;
      res.status(200).json({ user: otherDetails, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
  getUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await Users.findById(id);
      if (user) {
        const attendanceRecords = await Attendance.find({ user: id });
        const { password, ...otherDetails } = user._doc;
        return res.status(200).send({ message: "Success", user: otherDetails, attendance: attendanceRecords });
      }
      res.status(404).send({ message: "User not found!" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },
  getAllUsers: async function (req, res) {
    try {
      if (req.userIsAdmin || req.user.role === 'teacher') {
        const user = await Users.find().select("_id email number firstName lastName group role");
        res.status(200).send({ message: "All groups", users: user });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // Update a User
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { userIsAdmin } = req;
    try {
      if (userIsAdmin || req.user.role === "teacher") {
        if (req.body.email) {
          const oldUser = await Users.findOne({ email: req.body.email });
          if (oldUser)
            return res
              .status(400)
              .json({ message: "This is email already exists!" });
        }

        if (req.body.password) {
          const hashedPassword = await bcrypt.hash(req.body.password, 12);
          req.body.password = hashedPassword;
        }

        const updatedUser = await Users.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        const { password, ...otherDetails } = updatedUser._doc;
        res.status(200).json(otherDetails);
      } else {
        res
          .status(403)
          .json({
            message: " Access Deined!. You can update only your own Account!",
          });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      if (
        id === req.user.id ||
        req.userIsAdmin ||
        req.user.role === "teacher"
      ) {
        // Delete images
        const deletedUser = await Users.findByIdAndDelete(id);
        if (deletedUser) {
          return res
            .status(200)
            .json({ message: "User deleted successfully!", deletedUser });
        }
        res.status(404).json({ message: "User not found!" });
      } else {
        res.status(403).json({
          message: "Access Deined!. You can delete only your own Account!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userCtrl;
