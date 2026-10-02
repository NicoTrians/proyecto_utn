var pool = require('./bd');
var md5 = require('md5');

/**
 * Busca un usuario por DNI y contraseña (hasheada en md5).
 */
async function getUserByDniAndPassword(dni, password) {
    try {
        var query = 'select * from usuarios where dni = ? and password = ? limit 1';
        var rows = await pool.query(query, [dni, md5(password)]);
        return rows[0];
    } catch (error) {
        console.error('Error en getUserByDniAndPassword:', error);
        throw error;
    }
}

/**
 * Busca un usuario por su DNI.
 */
async function getUserByDni(dni) {
    try {
        var query = 'select * from usuarios where dni = ? limit 1';
        var rows = await pool.query(query, [dni]);
        return rows[0];
    } catch (error) {
        console.error('Error en getUserByDni:', error);
        throw error;
    }
}

/**
 * Inserta un nuevo usuario en la base de datos con contraseña hasheada en md5.
 */
async function insertUsuario(usuario) {
    try {
        var query = 'insert into usuarios (nombre, apellido, edad, direccion, celular, dni, password) values (?, ?, ?, ?, ?, ?, ?)';
        var rows = await pool.query(query, [
            usuario.nombre,
            usuario.apellido,
            usuario.edad,
            usuario.direccion,
            usuario.celular,
            usuario.dni,
            md5(usuario.password)
        ]);
        return rows;
    } catch (error) {
        console.error('Error en insertUsuario:', error);
        throw error;
    }
}

/**
 * Compatibilidad con código previo si se busca por usuario y contraseña.
 */
async function getUserAndPassword(user, password) {
    try {
        var query = 'select * from usuarios where usuario = ? and password = ? limit 1';
        var rows = await pool.query(query, [user, md5(password)]);
        return rows[0];
    } catch (error) {
        console.error('Error en getUserAndPassword:', error);
        throw error;
    }
}

module.exports = {
    getUserByDniAndPassword,
    getUserByDni,
    insertUsuario,
    getUserAndPassword
};