var express = require('express');
var router = express.Router();
var usuariosModel = require('../models/usuariosModel');

/* Middleware de protección para usuarios autenticados */
function requireAuth(req, res, next) {
    if (req.session && req.session.id_usuario) {
        return next();
    }
    res.redirect('/login');
}

/* GET perfil del usuario conectado */
router.get('/', requireAuth, async function (req, res, next) {
    try {
        var usuario = await usuariosModel.getUserById(req.session.id_usuario);
        if (!usuario) {
            req.session.destroy();
            return res.redirect('/login');
        }
        res.render('perfil', { usuario });
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        res.redirect('/');
    }
});

/* POST modificar únicamente la dirección */
router.post('/modificar-direccion', requireAuth, async function (req, res, next) {
    try {
        var { direccion } = req.body;

        if (!direccion || !direccion.trim()) {
            var usuario = await usuariosModel.getUserById(req.session.id_usuario);
            return res.render('perfil', {
                usuario,
                error: true,
                message: 'La dirección no puede estar vacía.'
            });
        }

        await usuariosModel.updateDireccion(req.session.id_usuario, direccion.trim());
        var usuarioActualizado = await usuariosModel.getUserById(req.session.id_usuario);

        res.render('perfil', {
            usuario: usuarioActualizado,
            success: true,
            message: 'Dirección actualizada correctamente.'
        });
    } catch (error) {
        console.error('Error al actualizar dirección:', error);
        var usuarioActual = await usuariosModel.getUserById(req.session.id_usuario);
        res.render('perfil', {
            usuario: usuarioActual,
            error: true,
            message: 'Ocurrió un error al actualizar la dirección.'
        });
    }
});

/* POST / GET eliminar usuario de la base de datos sin preguntar nada */
router.post('/eliminar', requireAuth, async function (req, res, next) {
    try {
        await usuariosModel.deleteUsuario(req.session.id_usuario);
        req.session.destroy(function () {
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.redirect('/');
    }
});

router.get('/eliminar', requireAuth, async function (req, res, next) {
    try {
        await usuariosModel.deleteUsuario(req.session.id_usuario);
        req.session.destroy(function () {
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.redirect('/');
    }
});

module.exports = router;
