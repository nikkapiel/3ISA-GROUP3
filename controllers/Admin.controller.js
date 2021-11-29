const Admin = require("../models/Admin.model");
const ExceptionHandler = require("../utils/ExceptionHandler");
const path = require('path');
const { 
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../utils/token");
const { verify } = require("../middlewares/auth");



exports.signup = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new ExceptionHandler("Missing username or password", 400));

  try {
    await Admin.create({ username, password })
      .then((admin) => {
        res.status(201).json({
          message: "Admin created successfully",
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new ExceptionHandler("Missing username or password", 400));

  try {
    await Admin.findOne({ username })
      .then((admin) => {
        if (!admin) return next(new ExceptionHandler("Invalid username/password.", 404));

        admin.comparePassword(password, (err, isMatch) => {
          if (err) return next(err);

          if (!isMatch)
            return next(new ExceptionHandler("Invalid username/password.", 401));

          const accessToken = createAccessToken(admin._id),
          refreshToken = createRefreshToken(admin._id);
        
          admin.refreshToken = refreshToken;
          admin.save((err, result)=>{
            if(err) return next(err);
            sendRefreshToken(res, refreshToken);
            sendAccessToken(req, res, accessToken);
          });
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie("refreshToken", { path: "/refresh_token" });
  localStorage.removeItem("token");
  return res.send({ message: "Logged out successfully." });
};

exports.authenticate = async (req, res, next) => {
    try {
        const adminID = verify(req);
        if(adminID){
            res.json({
                authenticated: true,
                id: adminID
            })
        }
    } catch (error) {
        next(error);
    }
}

