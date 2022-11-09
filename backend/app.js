var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
//Database connection
require("./models/connection");
//Routers imports
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tripsRouter = require("./routes/trips");
var cartsRouter = require("./routes/carts");

var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/trips", tripsRouter);
app.use("/carts", cartsRouter);

module.exports = app;
