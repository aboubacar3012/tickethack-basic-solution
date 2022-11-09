var express = require("express");
const Cart = require("../models/cart");
var router = express.Router();
/**
 * POST : permet d'envoyer un trajet dans le panier
 * @body departure, arrival, price, date
 * @return saved cart
 */
router.post("/", function (req, res, next) {
  const { departure, arrival, price, date } = req.body;
  const newCart = new Cart({ departure, arrival, price, date });
  newCart.save().then(() => res.json({ result: true, message: "Cart added successfully" }));
});

/**
 * GET : Recuperer tous les paniers
 * @body null
 * @params null
 * @return all not paid carts
 */
router.get("/", function (req, res, next) {
  Cart.find({ isPaid: false }).then((carts) => res.json({ result: true, carts }));
});

/**
 * DELETE : Recuperer tous les paniers
 * @body cart object
 * @params id
 * @return msg
 */
router.delete("/:id", function (req, res, next) {
  Cart.findByIdAndRemove(req.params.id).then((carts) => res.json({ result: true, carts }));
});
/**
 * UPDATE : Met a jour un cart par son Id
 * @params id
 * @return msg
 */
router.put("/:id", function (req, res, next) {
  Cart.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((updatedCart) =>
    res.json({ result: true, updatedCart })
  );
});

// Bookings
/**
 * GET : Recuperer tous les paniers isPaid
 * @body null
 * @params null
 * @return all paid carts
 */
router.get("/bookings", function (req, res, next) {
  Cart.find({ isPaid: true }).then((carts) => res.json({ result: true, carts }));
});

module.exports = router;
