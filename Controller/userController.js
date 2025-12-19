const jwt = require("jsonwebtoken");
const users = require("./../Model/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
      return res.status(401).json({
        status: "Failed",
        msg: "You are not logged in",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "Failed",
        msg: "User no longer exists",
      });
    }

    req.user = user;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "Failed",
        msg: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      status: "Failed",
      msg: "Invalid token. Please login again.",
    });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        status: "Failed",
        msg: "Email and Password Should not be Empty",
      });
    }
    const user = await users.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "Failed",
        msg: "Invaild Email or Password",
      });
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: "Success",
      token: token,
      data: {
        Name: user.name,
        Email: user.email,
        Role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
        status : "Failed",
        msg : error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const newUser = await users.create(req.body);
    const token = signToken(newUser.id);
    res.status(201).json({
      status: "Success",
      token: token,
      data : {
        Name : newUser.name,
        Email : newUser.email,
        Role : newUser.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "Failed",
        msg: "User Already Exists , please Use Another",
      });
    }
    res.status(400).json({
      status: "Failed",
      msg: error.message,
    });
  }
};
