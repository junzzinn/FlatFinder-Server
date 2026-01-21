const express = require("express");
const router = express.Router();

const users = require("../controllers/users.controller");
const { requireAuth } = require("../middleware/auth");
const { requireAdmin, requireAdminOrSelf } = require("../middleware/permissions");

router.post("/register", users.register);
router.post("/login", users.login);

router.use(requireAuth);

router.get("/", requireAdmin, users.getAllUsers);

router.get("/:id", users.getUserById);

router.patch("/:id", requireAdminOrSelf("id"), users.updateUser);

router.delete("/:id", requireAdminOrSelf("id"), users.deleteUser);

module.exports = router;
