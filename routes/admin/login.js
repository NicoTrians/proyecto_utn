var express = require('express');
var router = express.Router();

/* GET jubilados page. */
router.get('/', function (req, res, next) {
    res.render('login'); // Renderiza la vista jubilados.hbs
});

module.exports = router;
