const express = require('express');
const router = express.Router();

const pool = require('../database.js');

router.get('/add', (req, res) => {
    res.render('announcements/addAnnoun');
});

router.post('/add', async (req, res) => {
    const { titulo, imagen, archivo, descripcion, pregunta, estado, semestre, carrera, fecha_ini,
        fecha_fin, fecha_ini_repo, fecha_fin_repo } = req.body;
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
        fecha_fin,
        fecha_ini_repo,
        fecha_fin_repo
    };
    await pool.query('INSERT INTO convocatorias SET ?', [newEvent]);
    req.flash('success', 'Registro de actividad correctamente.');
    res.redirect('/announs');
});


router.get('/', async (req, res) => {
    const announs = await pool.query('SELECT * FROM convocatorias ORDER BY fecha_cre DESC');
    console.log(announs);
    res.render('announcements/listAnnouns', { announs });
});

router.get('/movil', async (req, res) => {
    const announs = await pool.query('SELECT id_conv, titulo, descripcion, imagen FROM convocatorias WHERE estado = "Disponible" ORDER BY fecha_cre DESC');
    console.log(announs);
    res.json(announs);
});

router.get('/movil/view/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    const announ = await pool.query('SELECT * FROM convocatorias WHERE id_conv = ?', [id_conv]);
    const conv = {
        id_conv: announ[0].id_conv,
        titulo: announ[0].titulo,
        imagen: announ[0].imagen,
        archivo: announ[0].archivo.toString(),
        descripcion: announ[0].descripcion,
        pregunta: announ[0].pregunta,
        estado: announ[0].estado,
        semestre: announ[0].semestre,
        carrera: announ[0].carrera,
        fecha_ini: formatDate(announ[0].fecha_ini),
        fecha_fin: formatDate(announ[0].fecha_fin),
        fecha_ini_repo: formatDate(announ[0].fecha_ini_repo),
        fecha_fin_repo: formatDate(announ[0].fecha_fin_repo)
    };
    console.log(announ);
    res.json(conv);
});

router.post('/movil/register', async (req, res) => {
    console.log(req.body);
    const { id_conv, titulo, no_control, nombre, apellido_p, apellido_m, carrera, semestre, correo_ext, archivo } = req.body;
    if (semestre != '') {
        const register = {
            id_conv,
            titulo,
            no_control,
            nombre,
            apellido_p,
            apellido_m,
            carrera,
            semestre,
            correo_ext,
            archivo
        };
        try {
            const registerA = await pool.query('SELECT * FROM registros_C_A WHERE id_conv = ? AND no_control = ?', [id_conv, no_control]);
            if (registerA.length===0) {
                await pool.query('INSERT INTO registros_C_A SET ?', [register]);
            }
        } catch (e) {
            console.log(e)
        }
    } else if (semestre == '') {
        const register = {
            id_conv,
            titulo,
            no_control,
            nombre,
            apellido_p,
            apellido_m,
            departamento: carrera,
            correo_ext,
            archivo
        };
        try {
            const registerD = await pool.query('SELECT * FROM registros_C_D WHERE id_conv = ? AND no_control = ?', [id_conv, no_control]);
            if (registerD.length===0) {
                await pool.query('INSERT INTO registros_C_D SET ?', [register]);
            }
        } catch (e) {
            console.log(e)
        }
    }
});

router.get('/delete/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    console.log(id_conv);
    await pool.query('DELETE FROM aceptados_C_A WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM aceptados_C_D WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM rechazados_C_A WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM rechazados_C_D WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM registros_C_A WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM registros_C_D WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM reportes_C_A WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM reportes_C_D WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM guardado_reportes_C_A WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM guardado_reportes_C_A WHERE id_conv = ?', [id_conv]);
    await pool.query('DELETE FROM convocatorias WHERE id_conv = ?', [id_conv]);
    req.flash('message', 'Eliminación de la actividad y datos correctamente.');
    res.redirect('/announs');
});

router.get('/edit/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    console.log(id_conv);
    const announ = await pool.query('SELECT * FROM convocatorias WHERE id_conv = ?', [id_conv]);
    const conv = {
        id_conv: announ[0].id_conv,
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
    console.log(announ[0].titulo.toString());
    console.log(conv);
    res.render('announcements/editAnnoun', { conv });
});

router.post('/edit/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    const { titulo, imagen, archivo, imagen2, archivo2, descripcion, pregunta, estado, semestre, carrera, fecha_ini, fecha_fin, fecha_ini_repo, fecha_fin_repo } = req.body;
    let img = imagen;
    let arc = archivo;
    if (img == '' && arc == '') {
        const newEvent = {
            titulo,
            imagen: imagen2,
            archivo: archivo2,
            descripcion,
            pregunta,
            estado,
            semestre: semestre.toString(),
            carrera: carrera.toString(),
            fecha_ini,
            fecha_fin,
            fecha_ini_repo,
            fecha_fin_repo
        };
        console.log(req.body);
        await pool.query('UPDATE convocatorias set ? WHERE id_conv = ?', [newEvent, id_conv]);
        req.flash('success', 'Actualización de datos correctamente.');
        res.redirect('/announs');
    } else {
        if (img == '') {
            const newEvent = {
                titulo,
                imagen: imagen2,
                archivo,
                descripcion,
                pregunta,
                estado,
                semestre: semestre.toString(),
                carrera: carrera.toString(),
                fecha_ini,
                fecha_fin,
                fecha_ini_repo,
                fecha_fin_repo
            };
            console.log(req.body);
            await pool.query('UPDATE convocatorias set ? WHERE id_conv = ?', [newEvent, id_conv]);
            req.flash('success', 'Actualización de datos correctamente.');
            res.redirect('/announs');
        } else if (arc == '') {
            const newEvent = {
                titulo,
                imagen,
                archivo: archivo2,
                descripcion,
                pregunta,
                estado,
                semestre: semestre.toString(),
                carrera: carrera.toString(),
                fecha_ini,
                fecha_fin,
                fecha_ini_repo,
                fecha_fin_repo
            };
            console.log(req.body);
            await pool.query('UPDATE convocatorias set ? WHERE id_conv = ?', [newEvent, id_conv]);
            req.flash('success', 'Actualización de datos correctamente.');
            res.redirect('/announs');
        } else {
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
                fecha_fin,
                fecha_ini_repo,
                fecha_fin_repo
            };
            console.log(req.body);
            await pool.query('UPDATE convocatorias set ? WHERE id_conv = ?', [newEvent, id_conv]);
            req.flash('success', 'Actualización de datos correctamente.');
            res.redirect('/announs');
        }
    }

});

router.get('/view/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    // console.log(id_conv);
    const announ = await pool.query('SELECT * FROM convocatorias WHERE id_conv = ?', [id_conv]);
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
    console.log(announ[0].id_conv);
    // console.log(conv);
    res.render('announcements/viewAnnoun', { conv });
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