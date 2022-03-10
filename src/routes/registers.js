const express = require('express');
const router = express.Router();

const pool = require('../database.js');

router.get('/', (req, res) => {
    res.render('registers/listRegisters');
});

router.get('/participants1', async (req, res) => {
    const announs = await pool.query('SELECT * FROM convocatorias ORDER BY fecha_cre DESC');
    console.log(announs);
    res.render('registers/listParticipants', { announs });
});

router.get('/participants2', async (req, res) => {
    const events = await pool.query('SELECT * FROM eventos ORDER BY fecha_cre DESC');
    console.log(events);
    res.render('registers/listParticipants2', { events });
});

router.get('/participants3', async (req, res) => {
    const scholars = await pool.query('SELECT * FROM becas ORDER BY fecha_cre DESC');
    console.log(scholars);
    res.render('registers/listParticipants3', { scholars });
});

router.get('/participants/profile/:no_control', async (req, res) => {
    const { no_control } = req.params;
    const profile = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control])
    res.render('registers/viewProfile', { profile: profile[0] });
});

router.get('/type/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    // console.log(id_conv);
    const announ = await pool.query('SELECT * FROM convocatorias WHERE id_conv = ?', [id_conv]);
    res.render('registers/participantType', { announ: announ[0] });
});

router.get('/type2/:id_evento', async (req, res) => {
    const { id_evento } = req.params;
    // console.log(id_conv);
    const event = await pool.query('SELECT * FROM eventos WHERE id_evento = ?', [id_evento]);
    res.render('registers/participantType2', { event: event[0] });
});

router.get('/type3/:id_beca', async (req, res) => {
    const { id_beca } = req.params;
    // console.log(id_conv);
    const scholar = await pool.query('SELECT * FROM becas WHERE id_beca = ?', [id_beca]);
    res.render('registers/participantType3', { scholar: scholar[0] });
});

router.get('/accepted/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    const accepteds = await pool.query('SELECT * FROM aceptados_C_A WHERE id_conv = ?', [id_conv]);
    const accepteds2 = await pool.query('SELECT * FROM aceptados_C_D WHERE id_conv = ?', [id_conv])
    res.render('registers/accepted', { accepteds, accepteds2 });
});

router.get('/aspirants/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    const registers = await pool.query('SELECT * FROM registros_C_A WHERE id_conv = ?', [id_conv])
    const registers2 = await pool.query('SELECT * FROM registros_C_D WHERE id_conv = ?', [id_conv])
    res.render('registers/aspirants', { registers, registers2 });
});

router.post('/accepted/add/:id_reg/:no_control', async (req, res) => {
    const { id_reg, no_control } = req.params;
    console.log(req.params);
    const user = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const user2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    if (user.length > 0) {
        const reg = await pool.query('SELECT * FROM registros_C_A WHERE id_reg = ? AND no_control = ?', [id_reg, no_control]);
        console.log(reg)
        const acep = {
            id_conv: reg[0].id_conv,
            titulo: reg[0].titulo,
            no_control: reg[0].no_control,
            nombre: reg[0].nombre,
            apellido_p: reg[0].apellido_p,
            apellido_m: reg[0].apellido_m,
            carrera: reg[0].carrera,
            semestre: reg[0].semestre,
            correo_ext: reg[0].correo_ext,
            archivo: reg[0].archivo
        };
        console.log(reg)
        await pool.query('INSERT INTO aceptados_C_A SET ?', [acep]);
        await pool.query('DELETE FROM registros_C_A WHERE id_reg = ?', [id_reg]);
        res.redirect('/registers/participants1');
    } else if (user2.length > 0) {
        const reg = await pool.query('SELECT * FROM registros_C_D WHERE id_reg = ? AND no_control = ?', [id_reg, no_control]);
        console.log(reg)
        const acep = {
            id_conv: reg[0].id_conv,
            titulo: reg[0].titulo,
            no_control: reg[0].no_control,
            nombre: reg[0].nombre,
            apellido_p: reg[0].apellido_p,
            apellido_m: reg[0].apellido_m,
            departamento: reg[0].departamento,
            correo_ext: reg[0].correo_ext,
            archivo: reg[0].archivo
        };
        console.log(reg)
        await pool.query('INSERT INTO aceptados_C_D SET ?', [acep]);
        await pool.query('DELETE FROM registros_C_D WHERE id_reg = ?', [id_reg]);
        res.redirect('/registers/participants1');
    }
});

router.get('/view/register/:id_reg/:no_control', async (req, res) => {
    const { id_reg, no_control } = req.params;
    const user = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const user2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    if (user.length > 0) {
        const register = await pool.query('SELECT *  FROM registros_C_A WHERE id_reg = ?', [id_reg]);
        res.render('registers/viewRegister', { register: register[0] });
    } else if (user2.length > 0) {
        const register = await pool.query('SELECT *  FROM registros_C_D WHERE id_reg = ?', [id_reg]);
        res.render('registers/viewRegister2', { register: register[0] });
    }
});

router.get('/accepted/delete/:id_reg/:no_control', async (req, res) => {
    const { id_reg, no_control } = req.params;
    const user = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const user2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    if (user.length > 0) {
        await pool.query('DELETE FROM aceptados_C_A WHERE id_reg = ?', [id_reg]);
        res.redirect('/registers/participants1')
    } else if (user2.length > 0) {
        await pool.query('DELETE FROM aceptados_C_D WHERE id_reg = ?', [id_reg]);
        res.redirect('/registers/participants1')
    }
});

router.post('/rejected/add/:id_reg/:no_control', async (req, res) => {
    const { id_reg, no_control } = req.params;
    console.log(req.params);
    const user = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const user2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    if (user.length > 0) {
        const reg = await pool.query('SELECT * FROM registros_C_A WHERE id_reg = ? AND no_control = ?', [id_reg, no_control]);
        console.log(reg)
        const acep = {
            id_conv: reg[0].id_conv,
            titulo: reg[0].titulo,
            no_control: reg[0].no_control,
            nombre: reg[0].nombre,
            apellido_p: reg[0].apellido_p,
            apellido_m: reg[0].apellido_m,
            carrera: reg[0].carrera,
            semestre: reg[0].semestre,
            correo_ext: reg[0].correo_ext,
            archivo: reg[0].archivo
        };
        console.log(reg)
        await pool.query('INSERT INTO rechazados_C_A SET ?', [acep]);
        await pool.query('DELETE FROM registros_C_A WHERE id_reg = ?', [id_reg]);
        res.redirect('/registers/participants1');
    } else if (user2.length > 0) {
        const reg = await pool.query('SELECT * FROM registros_C_D WHERE id_reg = ? AND no_control = ?', [id_reg, no_control]);
        console.log(reg)
        const acep = {
            id_conv: reg[0].id_conv,
            titulo: reg[0].titulo,
            no_control: reg[0].no_control,
            nombre: reg[0].nombre,
            apellido_p: reg[0].apellido_p,
            apellido_m: reg[0].apellido_m,
            departamento: reg[0].departamento,
            correo_ext: reg[0].correo_ext,
            archivo: reg[0].archivo
        };
        console.log(reg)
        await pool.query('INSERT INTO rechazados_C_D SET ?', [acep]);
        await pool.query('DELETE FROM registros_C_D WHERE id_reg = ?', [id_reg]);
        res.redirect('/registers/participants1');
    }
});

router.get('/rejected/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    const rejecteds = await pool.query('SELECT * FROM rechazados_C_A WHERE id_conv = ?', [id_conv]);
    const rejecteds2 = await pool.query('SELECT * FROM aceptados_C_D WHERE id_conv = ?', [id_conv])
    res.render('registers/rejected', { rejecteds, rejecteds2 });
});

router.get('/accepted2/:id_evento', async (req, res) => {
    const { id_evento } = req.params;
    const accepteds = await pool.query('SELECT * FROM aceptados_C_A WHERE id_evento = ?', [id_evento]);
    res.render('registers/accepted', { accepteds });
});

router.get('/aspirants2/:id_evento', async (req, res) => {
    const { id_evento } = req.params;
    const registers = await pool.query('SELECT * FROM registros_C_A WHERE id_evento = ?', [id_evento])
    res.render('registers/aspirants', { registers });
});

router.get('/rejected2/:id_evento', async (req, res) => {
    const { id_evento } = req.params;
    const rejecteds = await pool.query('SELECT * FROM rechazados_C_A WHERE id_evento = ?', [id_evento]);
    res.render('registers/rejected', { rejecteds });
});

module.exports = router;