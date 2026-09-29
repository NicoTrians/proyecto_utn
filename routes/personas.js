var express = require('express');
var router = express.Router();

/* GET personas page. */
router.get('/', function(req, res, next) {
  res.render('personas'); // Renderiza la vista personas.hbs
});

module.exports = router;
