const Role = require("../../models/role");

module.exports = {
  createRole: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole !== "superAdmin") {
      throw new Error("Unauthorized");
    }
    try {
      const savedRole = await Role.findOne({ title: args.roleName });
      if (savedRole) {
        throw new Error("Role exists already");
      }
      const newRole = {
        title: args.roleName,
      };
      const role = new Role(newRole);
      const result = await role.save();
      return result;
    } catch (err) {
      throw err;
    }
  },

  roles: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    if (req?.checkRole === "user") {
      throw new Error("Unauthorized");
    }
    try {
      const roles = await Role.find().populate("users");
      return roles;
    } catch (err) {
      throw err;
    }
  },
};
