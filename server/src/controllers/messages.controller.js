const Message = require("../models/Message");
const Flat = require("../models/Flat");

async function getAllMessages(req, res, next) {
  try {
    const flatId = req.params.id;

    const messages = await Message.find({ flatId }).sort({ created: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

async function getUserMessages(req, res, next) {
  try {
    const flatId = req.params.id;
    const senderId = req.params.senderId;

    if (req.user?._id?.toString() !== senderId.toString() && !req.user?.isAdmin) {
      return res.status(403).json({ message: "Sender only" });
    }

    const messages = await Message.find({ flatId, senderId }).sort({ created: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

async function addMessage(req, res, next) {
  try {
    const flatId = req.params.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const flat = await Flat.findById(flatId);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    const message = await Message.create({
      content,
      flatId,
      senderId: req.user._id,
    });

    res.status(201).json({ message: "Message created", message: message });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllMessages, getUserMessages, addMessage };
