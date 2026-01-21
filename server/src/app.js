const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const usersRoutes = require("./routes/users.routes");
const flatsRoutes = require("./routes/flats.routes");

const { requireAuth } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/users", usersRoutes);

app.use(requireAuth);
app.use("/flats", flatsRoutes);

module.exports = app;
