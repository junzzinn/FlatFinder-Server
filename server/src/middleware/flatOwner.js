const Flat = require("../models/Flat");

async function requireFlatOwner(req, res, next) {
  try {
    const flatId = req.params.id;
    const flat = await Flat.findById(flatId);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    if (req.user?.isAdmin) {
      req.flat = flat;
      return next();
    }

    if (flat.ownerId.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ message: "Flat owner only" });
    }

    req.flat = flat;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireFlatOwner };
