const express = require("express");
const router = express.Router();

const flats = require("../controllers/flats.controller");
const { requireFlatOwner } = require("../middleware/flatOwner");

router.get("/", flats.getAllFlats);
router.post("/", flats.addFlat);
router.get("/:id", flats.getFlatById);

router.patch("/:id", requireFlatOwner, flats.updateFlat);
router.delete("/:id", requireFlatOwner, flats.deleteFlat);

module.exports = router;
