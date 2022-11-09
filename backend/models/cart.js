const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  price: Number,
  isPaid: {
    type: Boolean,
    default: false,
  },
});

const Cart = mongoose.model("carts", cartSchema);
module.exports = Cart;
