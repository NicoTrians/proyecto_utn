var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async (req, res) => {
  var { nombre, apellido, email, tel, telefono, mensaje } = req.body; 
  var telefonoContacto = tel || telefono || 'No proporcionado';

  var obj = {
    from: 'hello@demomailtrap.co',
    to: 'nicolastrians@gmail.com',
    subject: 'Contacto desde la web',
    html: `${nombre} ${apellido} se contactó a través del formulario y quiere más información a este correo: ${email}. <br> Teléfono: ${telefonoContacto} <br> Además, hizo el siguiente comentario: ${mensaje}`
  };

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transport.sendMail(obj);
    res.render('index', {
      mensaje: "Mensaje enviado correctamente",
      message: "Mensaje enviado correctamente"
    });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.render('index', {
      mensaje: "Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.",
      message: "Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.",
      error: true
    });
  }
});

module.exports = router;
