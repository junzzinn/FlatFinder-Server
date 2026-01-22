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
      email: email.toLowerCase(),
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

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { email, password, firstName, lastName, birthDate, isAdmin } = req.body;

    const updates = {};
    if (email !== undefined) updates.email = email.toLowerCase();
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (birthDate !== undefined) updates.birthDate = birthDate;

    if (isAdmin !== undefined) {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: "Only admin can change isAdmin" });
      }
      updates.isAdmin = !!isAdmin;
    }

    if (password !== undefined) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Updated", user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Deleted", user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
