var express = require("express");
const Trip = require("../models/trip");
var router = express.Router();
const moment = require("moment");
/**
 * GET : permet de recupers tous les trajets disponible
 * @params departure, arrival
 * @return array of trips
 */
router.get("/", function (req, res, next) {
  const { departure, arrival, date } = req.query;

  Trip.find({
    departure: { $regex: new RegExp(departure, "i") },
    arrival: { $regex: new RegExp(arrival, "i") },
    date: { $gte: moment(date).startOf("day"), $lte: moment(date).endOf("day") },
  }).then(
    //   Trip.find({ departure, arrival, date: { $gte: moment(date).startOf("day"), $lte: moment(date).endOf("day") } }).then(
    (returnedTrips) => {
      if (returnedTrips.length > 0) {
        res.json({ result: true, trips: returnedTrips });
      } else {
        res.json({ result: false });
      }
    }
  );
});

module.exports = router;
