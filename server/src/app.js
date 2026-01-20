const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const usersRoutes = require("./routes/users.routes");

const app = express(); 

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/users", usersRoutes);

module.exports = app;
