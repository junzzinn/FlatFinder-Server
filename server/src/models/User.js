const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    isAdmin: { type: Boolean, default: false },
    favouriteFlats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flat" }],
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = mongoose.model("User", userSchema);
