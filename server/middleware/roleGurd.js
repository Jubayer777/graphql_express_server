module.exports = (req, res, next) => {
  const roleHeader = req.get("Role");
  if (roleHeader === "") {
    req.checkRole = "user";
    return next();
  }
  if (roleHeader === "user") {
    req.checkRole = "user";
    return next();
  }
  if (roleHeader === "superAdmin") {
    req.checkRole = "superAdmin";
    return next();
  }
  if (roleHeader === "admin") {
    req.checkRole = "admin";
    return next();
  }
  req.checkRole = "user";
  next();
};
