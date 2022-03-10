const express = require('express');
const router = express.Router();
const passport = require('passport');
const helpers = require('../lib/helpers');

const pool = require('../database.js');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/signin',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', (req, res) => {
    res.render('signIn/signInView');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/init',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.post('/movil/register', passport.authenticate('local.signupmovil', {
    successRedirect: 'Welcome!!!!',
    failureRedirect: 'ERROR!!!!!',
    failureFlash: true
}));

router.post('/movil/login', async (req, res) => {
    const { no_control, password } = req.body;
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const rows2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            const msg = {
                mensaje: "Bienvenido",
                no_control,
                password,
            };
            console.log(msg)
            res.json(msg);
        } else {
            const msg = {
                mensaje: "Contraseña Incorrecta",
                no_control,
                password,
            };
            console.log(msg)
            res.json(msg);
        }
    } else {
        if (rows2.length > 0) {
            const user = rows2[0];
            const validPassword = await helpers.matchPassword(password, user.password);
            if (validPassword) {
                const msg = {
                    mensaje: "Bienvenido",
                    no_control,
                    password,
                };
                console.log(msg)
                res.json(msg);
            } else {
                const msg = {
                    mensaje: "Contraseña Incorrecta",
                    no_control,
                    password,
                };
                console.log(msg)
                res.json(msg);
            }
        } else {
            const msg = {
                mensaje: "Usuario no encontrado",
                no_control,
                password,
            };
            console.log(msg)
            res.json(msg);
        }
    }
});

router.get('/movil/user/:no_control', async (req, res) => {
    const { no_control } = req.params;
    const rows = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const rows2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    if (rows.length > 0) {
        const user = rows[0];
        res.json(user)
    } else {
        if (rows2.length > 0) {
            const user = rows2[0];
            const user2 = {
                no_control: user.no_control,
                nombre: user.nombre,
                apellido_p: user.apellido_p,
                apellido_m: user.apellido_m,
                cargo: user.cargo,
                correo_ins: user.correo_ins,
                carrera: user.departamento,
                semestre: null,
                password: user.password
            }
            res.json(user2)
        }
    }
});

module.exports = router;