const express = require('express');
const router = express.Router();

const pool = require('../database.js');

router.get('/', async (rep, res) => {
    const announs = await pool.query('SELECT * FROM convocatorias ORDER BY fecha_cre DESC');
    const events = await pool.query('SELECT * FROM eventos ORDER BY fecha_cre DESC');
    const scholars = await pool.query('SELECT * FROM becas ORDER BY fecha_cre DESC');
    console.log(announs);
    res.render('pageInit/pageInit', { announs, events,scholars });
});

module.exports = router;