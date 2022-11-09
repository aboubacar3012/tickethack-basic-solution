const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://aboubacar:65498124@cluster0.jcr8a99.mongodb.net/tickethack";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Database connected successfully ✨✨");
  })
  .catch(() => {
    console.log("❌Database is not connected❌");
  });
