const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'no_control',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users_encargados WHERE no_control = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.nombre))
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta, vuelva a introducir la contraseña.'))
        }
    } else {
        return done(null, false, req.flash('message', 'Usuario no encontrado, verifique el numero de control.'))
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'no_control',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { nombre, apellido_p, apellido_m, correo_ins, cargo, departamento } = req.body;
    const newUser = {
        no_control: username,
        password,
        nombre,
        apellido_p,
        apellido_m,
        correo_ins,
        cargo,
        departamento
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users_encargados SET ?', [newUser]);
    newUser.id = result.insertId;
    console.log(result)
    return done(null, newUser)
}));

passport.use('local.signupmovil', new LocalStrategy({
    usernameField: 'no_control',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { cargo } = req.body;
    console.log(cargo)
    if (cargo === 'Alumno') {
        const { nombre, apellido_p, apellido_m, correo_ins, semestre, carrera } = req.body;
        const newUser = {
            no_control: username,
            password,
            nombre,
            apellido_p,
            apellido_m,
            correo_ins,
            cargo,
            semestre,
            carrera
        };
        newUser.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO users_alumnos SET ?', [newUser]);
        console.log(result)
    } else if (cargo === 'Docente') {
        const { nombre, apellido_p, apellido_m, correo_ins, cargo, carrera } = req.body;
        const newUser = {
            no_control: username,
            password,
            nombre,
            apellido_p,
            apellido_m,
            correo_ins,
            cargo,
            departamento: carrera
        };
        newUser.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO users_docentes SET ?', [newUser]);
        console.log(result)
    }

}));


passport.use('local.signinmovil', new LocalStrategy({
    usernameField: 'no_control',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            req.flash('success', 'Bienvenido ' + user.nombre);
        } else {
            req.flash('message','Contraseña incorrecta, vuelva a introducir la contraseña.');
        }
    }
    const rows2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [username])
    if (rows2.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            req.flash('success', 'Bienvenido ' + user.nombre);
        } else {
            req.flash('message','Contraseña incorrecta, vuelva a introducir la contraseña.');
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log(user.id)
});

passport.deserializeUser(async (id, done) => {
    const users = await pool.query('SELECT * FROM users_encargados WHERE id = ?', [id]);
    done(null, users[0]);
});
