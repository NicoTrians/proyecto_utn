var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


require('dotenv').config();
var pool = require('./models/bd');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var personasRouter = require('./routes/personas');
var beneficiosRouter = require('./routes/beneficios');
var inversionesRouter = require('./routes/inversiones');
var jubiladosRouter = require('./routes/jubilados');
var loginRouter = require('./routes/admin/login');
var adminNovedadesRouter = require('./routes/admin/novedades');
var perfilRouter = require('./routes/perfil');

var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'utn_proyecto_secreto_key_98765',
  resave: false,
  saveUninitialized: true
}));

// Pasar datos de sesión a las vistas (layout)
app.use(function (req, res, next) {
  if (req.session && req.session.nombre) {
    res.locals.nombre = req.session.nombre;
    res.locals.usuario = req.session.nombre;
    res.locals.id_usuario = req.session.id_usuario;
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/personas', personasRouter);
app.use('/beneficios', beneficiosRouter);
app.use('/inversiones', inversionesRouter);
app.use('/jubilados', jubiladosRouter);
app.use('/login', loginRouter);
app.use('/admin/login', loginRouter);
app.use('/perfil', perfilRouter);
app.post('/registro', function (req, res, next) {
  req.url = '/registro';
  loginRouter(req, res, next);
});
app.get('/logout', function (req, res) {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect('/');
});
app.use('/admin/novedades', adminNovedadesRouter);

//prueba de conexion a la base de datos
pool.query('select * from usuarios').then(function (resultados) {
  console.log(resultados);
}).catch(function (error) {
  console.error('Error al conectar/consultar la base de datos:', error.message);
});


// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
