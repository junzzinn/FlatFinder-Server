const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    flatId: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created", updatedAt: false } }
);

module.exports = mongoose.model("Message", messageSchema);
