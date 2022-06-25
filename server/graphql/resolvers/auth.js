const User = require("../../models/user");
const Event = require("../../models/event");
const Booking = require("../../models/booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/role");
require("dotenv").config();

module.exports = {
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      const role = await Role.findOne({ title: "user" });
      if (user) {
        throw new Error("User exists already");
      }
      const hashedPass = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPass,
        role: role._id,
      });
      const result = await newUser.save();
      await Role.findOneAndUpdate(
        { _id: role._id.toString() },
        { $push: { users: result._id } },
        { new: true }
      );
      const jwtToken = await jwt.sign(
        { userId: result._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );
      return {
        ...result._doc,
        password: null,
        accessToken: jwtToken,
        role: role,
      };
    } catch (err) {
      throw err;
    }
  },

  loginUser: async (args) => {
    try {
      const loginUser = await User.findOne({ email: args.userInput.email })
        .populate("role")
        .exec();
      if (loginUser) {
        const isValidUser = await bcrypt.compare(
          args.userInput.password,
          loginUser.password
        );
        if (isValidUser) {
          const jwtToken = await jwt.sign(
            { userId: loginUser._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
          );
          return { ...loginUser._doc, password: null, accessToken: jwtToken };
        } else {
          throw new Error("Authentication error");
        }
      } else {
        throw new Error("Authentication error");
      }
    } catch (err) {
      throw new Error("Authentication error");
    }
  },

  users: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole === "user") {
      throw new Error("Unauthorized");
    }
    try {
      const users = await User.find()
        .populate("role")
        .populate("createdEvents");
      return users;
    } catch (err) {
      throw err;
    }
  },

  deleteUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole === "user") {
      throw new Error("Unauthorized");
    }
    try {
      await Event.deleteMany({ creator: args.userId });
      await Booking.deleteMany({ user: args.userId });
      await User.deleteOne({ _id: args.userId });
      return "User Deleted Successfully";
    } catch (err) {
      throw err;
    }
  },

  updateUserRole: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole !== "superAdmin") {
      throw new Error("Unauthorized");
    }
    try {
      const userId = args.userRoleInput.userId;
      const roleId = args.userRoleInput.roleId;
      const savedUser = await User.findOne({ _id: userId }).populate("role");
      const newUser = {
        role: roleId,
      };
      if (savedUser.role.title === "user") {
        await Booking.deleteMany({ user: userId });
      }
      if (savedUser.role.title !== "user") {
        newUser.createdEvents = [];
        savedUser.createdEvents.map(
          async (e) => await Event.deleteOne({ _id: e })
        );
      }

      await User.findByIdAndUpdate({ _id: userId }, newUser, {
        new: true,
      });
      await Role.findOneAndUpdate(
        { _id: savedUser.role._id },
        { $pull: { users: userId } },
        { new: true }
      );
      await Role.findOneAndUpdate(
        { _id: roleId },
        { $push: { users: userId } },
        { new: true }
      );

      return "User Role Updated Successfully";
    } catch (err) {
      throw err;
    }
  },
};
