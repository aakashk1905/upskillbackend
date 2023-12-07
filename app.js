const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Route imports

const user = require("./routes/userRoutes");
app.use("/api/v1", user);
const push = require("./routes/pushRoutes");
app.use("/api/v1", push);

module.exports = app;
