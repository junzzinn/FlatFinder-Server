const Flat = require("../models/Flat");

async function getAllFlats(req, res, next) {
  try {
    const flats = await Flat.find().sort({ created: -1 });
    res.json(flats);
  } catch (err) {
    next(err);
  }
}

async function getFlatById(req, res, next) {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json(flat);
  } catch (err) {
    next(err);
  }
}

async function addFlat(req, res, next) {
  try {
    const {
      city,
      streetName,
      streetNumber,
      areaSize,
      hasAC,
      yearBuilt,
      rentPrice,
      dateAvailable,
    } = req.body;

    if (
      !city ||
      !streetName ||
      streetNumber === undefined ||
      areaSize === undefined ||
      yearBuilt === undefined ||
      rentPrice === undefined ||
      !dateAvailable
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const flat = await Flat.create({
      city,
      streetName,
      streetNumber,
      areaSize,
      hasAC: !!hasAC,
      yearBuilt,
      rentPrice,
      dateAvailable,
      ownerId: req.user._id,
    });

    res.status(201).json({ message: "Flat created", flat });
  } catch (err) {
    next(err);
  }
}

async function updateFlat(req, res, next) {
  try {
    const flat = req.flat;

    const allowed = [
      "city",
      "streetName",
      "streetNumber",
      "areaSize",
      "hasAC",
      "yearBuilt",
      "rentPrice",
      "dateAvailable",
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        flat[key] = req.body[key];
      }
    }

    await flat.save();
    res.json({ message: "Flat updated", flat });
  } catch (err) {
    next(err);
  }
}

async function deleteFlat(req, res, next) {
  try {
    const flat = req.flat;
    await flat.deleteOne();
    res.json({ message: "Flat deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllFlats,
  getFlatById,
  addFlat,
  updateFlat,
  deleteFlat,
};
