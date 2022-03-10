const express = require('express');
const router = express.Router();

const pool  = require('../database.js');

router.get('/add', (req, res) => {
    res.render('events/addEvent');
});

router.post('/add', async (req, res) => {
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
    await pool.query('INSERT INTO eventos SET ?',[newEvent]);
    res.redirect('/events');
});

router.get('/', async (rep, res) => {
    const events = await pool.query('SELECT * FROM eventos ORDER BY fecha_cre DESC');
    console.log(events);
    res.render('events/listEvents', {events});
});

router.get('/delete/:id_evento', async (req, res) => {
    const {id_evento} = req.params;
    await pool.query('DELETE FROM eventos WHERE id_evento = ?', [id_evento]);
    res.redirect('/events');
});

router.get('/edit/:id_evento', async (req, res) => {
    const {id_evento} = req.params;
    const event = await pool.query('SELECT * FROM eventos WHERE id_evento = ?', [id_evento]);
    console.log(event[0]);
    res.render('events/editEvent', {event: event[0]});
});

router.post('/edit/:id_evento', async (req, res) => {
    const {id_evento} = req.params;
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
    await pool.query('UPDATE eventos set ? WHERE id_evento = ?', [newEvent,id_evento]);
    res.redirect('/events');
});

router.get('/view/:id_evento', async (req, res) => {
    const { id_beca } = req.params;
    // console.log(id_conv);
    const announ = await pool.query('SELECT * FROM eventos WHERE id_evento = ?', [id_evento]);
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
    res.render('events/viewEvent', { conv });
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