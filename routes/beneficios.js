var express = require('express');
var router = express.Router();

/* GET beneficios page. */
router.get('/', function (req, res, next) {
    res.render('beneficios'); // Renderiza la vista beneficios.hbs
});

module.exports = router;
