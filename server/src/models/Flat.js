const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    streetName: { type: String, required: true, trim: true },
    streetNumber: { type: String, required: true, trim: true },
    areaSize: { type: Number, required: true, min: 0 },
    hasAC: { type: Boolean, default: false },
    yearBuilt: { type: Number, required: true, min: 1000 },
    rentPrice: { type: Number, required: true, min: 0 },
    dateAvailable: { type: Date, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = mongoose.model("Flat", flatSchema);
