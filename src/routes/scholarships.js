const express = require('express');
const router = express.Router();

const pool = require('../database.js');

router.get('/add', (req, res) => {
    res.render('scholarships/addScholarship');
});

router.post('/add', async (req, res) => {
    const { titulo, imagen, archivo, descripcion, pregunta, estado, semestre, carrera, fecha_ini,
        fecha_fin } = req.body;
    const newEvent = {
        titulo,
        imagen,
        archivo,
        descripcion,
        pregunta,
        estado,
        semestre: semestre.toString(),
        carrera: carrera.toString(),
        fecha_ini,
        fecha_fin
    };
    await pool.query('INSERT INTO becas SET ?', [newEvent]);
    res.redirect('/scholars');
});

router.get('/', async (rep, res) => {
    const scholars = await pool.query('SELECT * FROM becas ORDER BY fecha_cre DESC');
    console.log(scholars);
    res.render('scholarships/listScholarships', { scholars });
});

router.get('/delete/:id_beca', async (req, res) => {
    const {id_beca} = req.params;
    await pool.query('DELETE FROM becas WHERE id_beca = ?', [id_beca]);
    res.redirect('/scholars');
});

router.get('/edit/:id_beca', async (req, res) => {
    const {id_beca} = req.params;
    const scholar = await pool.query('SELECT * FROM convocatorias WHERE id_conv = ?', [id_beca]);
    console.log(scholar[0]);
    res.render('scholarships/editScholarship', {scholar: scholar[0]});
});

router.post('/edit/:id_beca', async (req, res) => {
    const {id_beca} = req.params;
    const { titulo, imagen, archivo, descripcion, pregunta, estado, semestre, carrera, fecha_ini, fecha_fin } = req.body;
    const newEvent = {
        titulo, 
        imagen, 
        archivo, 
        descripcion, 
        pregunta, 
        estado, 
        semestre: semestre.toString(), 
        carrera: carrera.toString(),
        fecha_ini,
        fecha_fin
    };
    await pool.query('UPDATE becas set ? WHERE id_beca = ?', [newEvent,id_beca]);
    res.redirect('/scholars');
});

router.get('/view/:id_beca', async (req, res) => {
    const { id_beca } = req.params;
    // console.log(id_conv);
    const announ = await pool.query('SELECT * FROM becas WHERE id_beca = ?', [id_beca]);
    const conv = {
        titulo: announ[0].titulo,
        imagen: announ[0].imagen,
        archivo: announ[0].archivo,
        descripcion: announ[0].descripcion,
        pregunta: announ[0].pregunta,
        estado: announ[0].estado,
        semestre: announ[0].semestre.split(','),
        carrera: announ[0].carrera.split(','),
        fecha_ini: formatDate(announ[0].fecha_ini),
        fecha_fin: formatDate(announ[0].fecha_fin),
        fecha_ini_repo: formatDate(announ[0].fecha_ini_repo),
        fecha_fin_repo: formatDate(announ[0].fecha_fin_repo)
    };
    console.log(announ[0].id_beca);
    // console.log(conv);
    res.render('scholarships/viewScholarship', { conv });
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = router;