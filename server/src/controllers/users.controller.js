const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signToken } = require("../middleware/auth");

async function register(req, res, next) {
  try {
    const { email, password, firstName, lastName, birthDate, isAdmin } = req.body;

    if (!email || !password || !firstName || !lastName || !birthDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      birthDate,
      isAdmin: !!isAdmin,
      favouriteFlats: [],
    });

    return res.status(201).json({
      message: "Registered",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing email/password" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
