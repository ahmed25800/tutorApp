const User = require("../models/user");
module.exports = (req, res, next) => {
  const userId = req.userId;
  User.findById(userId).then((user) => {
    if (user.role == "tutor") {
      next();
    } else {
      const error = new Error("Tutor Required");
      error.statudCode = 401;
      throw error;
    }
  });
};
