var express = require('express');
var router = express.Router();

/* GET inversiones page. */
router.get('/', function (req, res, next) {
    res.render('inversiones'); // Renderiza la vista inversiones.hbs
});

module.exports = router;
