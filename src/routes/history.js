var express = require("express");
var router = express.Router();
var roomsHistoryController = require("../controllers/roomsHistoryController");

router.post("/register", (req, res) => {
  roomsHistoryController.register(req, res);
});

module.exports = router;
