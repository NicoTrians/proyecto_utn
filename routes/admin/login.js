var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel');

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('login');
});

/* GET logout */
router.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session.destroy();
    }
    res.redirect('/');
});

/* POST login - Inicio de sesión usando dni y password */
router.post('/', async function (req, res, next) {
    try {
        var dni = req.body.dni;
        var password = req.body.password;

        if (!dni || !password) {
            return res.render('login', {
                error: true,
                message: 'alguno de los datos ingresados es erroneo'
            });
        }

        var data = await usuariosModel.getUserByDniAndPassword(dni, password);

        if (data != undefined) {
            req.session.id_usuario = data.id;
            req.session.nombre = data.nombre;
            req.session.apellido = data.apellido;
            req.session.dni = data.dni;
            res.redirect('/');
        } else {
            res.render('login', {
                error: true,
                message: 'alguno de los datos ingresados es erroneo'
            });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.render('login', {
            error: true,
            message: 'alguno de los datos ingresados es erroneo'
        });
    }
});

/* POST registro - Crear usuario con: Nombre, Apellido, edad, direccion, celular, dni, password */
router.post('/registro', async function (req, res, next) {
    try {
        var { nombre, apellido, edad, direccion, celular, dni, password } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!nombre || !apellido || !edad || !direccion || !celular || !dni || !password) {
            return res.render('login', {
                tabRegistro: true,
                errorRegistro: true,
                messageRegistro: 'Todos los campos son obligatorios.',
                formData: req.body
            });
        }

        // Verificar si el DNI ya existe en la base de datos
        var usuarioExistente = await usuariosModel.getUserByDni(dni);
        if (usuarioExistente) {
            return res.render('login', {
                tabRegistro: true,
                errorRegistro: true,
                messageRegistro: 'El DNI ingresado ya se encuentra registrado.',
                formData: req.body
            });
        }

        // Crear el nuevo usuario
        await usuariosModel.insertUsuario({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            edad: edad.toString().trim(),
            direccion: direccion.trim(),
            celular: celular,
            dni: dni,
            password: password
        });

        // Mostrar mensaje de éxito en la pestaña de inicio de sesión
        res.render('login', {
            success: true,
            message: 'Usuario creado exitosamente. Ya podés iniciar sesión con tu DNI y contraseña.',
            tabRegistro: false
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('login', {
            tabRegistro: true,
            errorRegistro: true,
            messageRegistro: 'Hubo un error al crear la cuenta. Por favor, intentá nuevamente.',
            formData: req.body
        });
    }
});

module.exports = router;
