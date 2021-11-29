const { sign } = require("jsonwebtoken");

// creating tokens
exports.createAccessToken = (id) => {
  return sign({ id }, process.env.TOKEN_KEY, { expiresIn: "30m" });
};

exports.createRefreshToken = (id) => {
  return sign({ id }, process.env.REFRESHER_KEY, { expiresIn: "7d" });
};

// send tokens

exports.sendAccessToken = (req, res, token) => {
  return res.send({
    accessToken: token,
    username: req.body.username,
  });
};

exports.sendRefreshToken = (res, token) => {
  return res.cookie("refreshtoken", token, {
    httpOnly: true,
    path: "/refresh_token",
    sameSite: "none",
    secure: true,
  });
};
