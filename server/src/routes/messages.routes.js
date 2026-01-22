const express = require("express");
const router = express.Router();

const messages = require("../controllers/messages.controller");
const { requireFlatOwner } = require("../middleware/flatOwner");

router.get("/:id/messages", requireFlatOwner, messages.getAllMessages);

router.get("/:id/messages/:senderId", messages.getUserMessages);

router.post("/:id/messages", messages.addMessage);

module.exports = router;
