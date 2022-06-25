const Booking = require("../../models/booking");
const Event = require("../../models/event");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole === "user") {
      throw new Error("Unauthorized");
    }
    try {
      const bookings = await Booking.find().populate("event").populate("user");
      return bookings;
    } catch (err) {
      throw err;
    }
  },

  bookingsByUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const userId = args.userId;
      const bookings = await Booking.find({ user: userId })
        .populate("event")
        .populate("user");
      return bookings;
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole !== "user") {
      throw new Error("Unauthorized");
    }
    try {
      const eventId = args.eventId;
      const event = await Event.findById({ _id: eventId });
      if (event) {
        const newBooking = new Booking({
          user: req.userId,
          event: eventId,
        });
        const result = await newBooking.save();
        return {
          ...result._doc,
          createdAt: new Date(result._doc.createdAt).toISOString(),
          updatedAt: new Date(result._doc.updatedAt).toISOString(),
        };
      } else if (!event) {
        throw new Error("Event not found");
      } else if (!user) {
        throw new Error("user not found");
      }
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      await Booking.deleteOne({ _id: args.bookingId });
      return "Booking Cancel Successful";
    } catch (err) {
      throw err;
    }
  },

  updateBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole === "user") {
      throw new Error("Unauthorized");
    }
    try {
      const newStatus = { status: await args.bookingInput.status };
      const id = await args.bookingInput.bookingId;
      await Booking.findByIdAndUpdate({ _id: id }, newStatus, {
        new: true,
      });
      return "Booking status Updated Successfully";
    } catch (err) {
      throw err;
    }
  },
};
