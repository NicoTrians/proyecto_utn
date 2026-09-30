var express = require('express');
var router = express.Router();

/* GET novedades page. */
router.get('/', function (req, res, next) {
    res.render('admin/novedades', {
        layout: 'admin/layout', // o simplemente 'layout' si no usás uno específico para admin
        usuario: req.session ? req.session.usuario : '' // Si usás variables de sesión
    });
});

module.exports = router;
