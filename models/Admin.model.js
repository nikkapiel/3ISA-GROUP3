const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
        type: String,
        required: false,
    }
  },
  {
    collection: 'admin',
  }
);

AdminSchema.pre("save", function (next) {
  const user = this;
  if (!this.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      return next();
    });
  });
});
AdminSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    return callback(null, isMatch);
  });
};
AdminSchema.methods.generateRefreshToken = function (callback) {
    const user = this;
    const token = jwt.sign(user._id, process.env.REFRESH_KEY,{
        expiresIn: "30d"
    });
    user.refreshToken = token;
    user.save(function (err, user) {
        if (err) return callback(err);
        return callback(null, user);
    });
};
AdminSchema.methods.generateToken = function () {
    const user = this;
    const token = jwt.sign(user._id, process.env.TOKEN_KEY, {
        expiresIn: "1h"
    });
    return token;
}

module.exports = mongoose.model("Admin", AdminSchema);
