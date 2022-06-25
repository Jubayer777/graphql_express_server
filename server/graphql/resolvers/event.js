const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      return events;
    } catch (err) {
      throw err;
    }
  },

  event: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const event = await Event.findById(args.eventId).populate("creator");
      return event;
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole === "user") {
      throw new Error("Unauthorized");
    }
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: args.eventInput.date,
        creator: req.userId,
      });
      const result = await event.save();
      await User.updateOne(
        { _id: req.userId },
        { $push: { createdEvents: result._doc._id } },
        { new: true }
      );
      return { ...result._doc, date: new Date(event._doc.date).toISOString() };
    } catch (err) {
      throw err;
    }
  },

  deleteEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole === "user") {
      throw new Error("Unauthorized");
    }
    try {
      const event = await Event.findById(args.eventId).populate("creator");
      await User.findOneAndUpdate(
        { _id: event.creator._id },
        { $pull: { createdEvents: args.eventId } },
        { new: true }
      );
      await Event.deleteOne({ _id: args.eventId });
      await Booking.deleteMany({ event: args.eventId });
      return "Event Deleted Successfully";
    } catch (err) {
      throw err;
    }
  },

  updateEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole === "user") {
      throw new Error("Unauthorized");
    }
    try {
      const event = await Event.findById({ _id: args.eventInput.eventId });
      if (!event) {
        throw new Error("Don't have permission");
      }
      const { eventId, ...rest } = args.eventInput;
      const eventData = rest;
      const newEvent = await Event.findByIdAndUpdate(
        { _id: args.eventInput.eventId, User: req.userId },
        eventData,
        { new: true }
      );
      return newEvent;
    } catch (err) {
      throw err;
    }
  },
};
