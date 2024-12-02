var express = require("express");
var router = express.Router();
var dashController = require("../controllers/dashController.js");

router.post("/showHistory", (req, res) => {
  dashController.showHistory(req, res);
});

module.exports = router;
