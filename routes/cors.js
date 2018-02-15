var express = require("express");
var router = express.Router();

router.get('/', function(req, res){
    res.send('ok')
});

router.get("*", function(req, res) {
    res.status(404).send("Cette route n'existe pas");
  });

router.post("*", function(req, res) {
    res.status(404).send("Cette route n'existe pas");
});

module.exports = router;