const express = require('express');
const router = express.Router();

const pool = require('../database.js');

router.get('/', (req, res) => {
    res.render('tracings/listTracing');
});

router.get('/reports', async (req, res) => {
    const announs = await pool.query('SELECT * FROM convocatorias ORDER BY fecha_cre DESC');
    console.log(announs);
    res.render('tracings/listActivities', { announs });
});

router.get('/table/:id_conv', async (req, res) => {
    const { id_conv } = req.params;
    const reporA = await pool.query('SELECT * FROM reportes_C_A WHERE id_conv = ?', [id_conv])
    const reporB = await pool.query('SELECT * FROM reportes_C_D WHERE id_conv = ?', [id_conv])
    res.render('tracings/tableTracings', { reporA, reporB });
});

router.get('/table/view/:no_control/:id_conv/:no_repor', async (req, res) => {
    const { no_control, id_conv, no_repor } = req.params;
    const reporE = await pool.query('SELECT * FROM reportes_C_A WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
    const reporF = await pool.query('SELECT * FROM reportes_C_D WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
    console.log(req.params);
    if (reporE.length > 0) {
        const reporte = {
            fecha_rea: formatDate(reporE[0].fecha_rea),
            no_control: reporE[0].no_control,
            nombre: reporE[0].nombre,
            apellido_p: reporE[0].apellido_p,
            apellido_m: reporE[0].apellido_m,
            carrera: reporE[0].carrera,
            titulo: reporE[0].titulo,
            descripcion: reporE[0].descripcion,
            estado: reporE[0].estado
        }

        res.render('tracings/viewTraicing', { reporte });
    } else if (reporF.length > 0) {
        const reporte = {
            fecha_rea: formatDate(reporF[0].fecha_rea),
            no_control: reporF[0].no_control,
            nombre: reporF[0].nombre,
            apellido_p: reporF[0].apellido_p,
            apellido_m: reporF[0].apellido_m,
            carrera: reporF[0].departamento,
            titulo: reporF[0].titulo,
            descripcion: reporF[0].descripcion,
            estado: reporF[0].estado
        }
        res.render('tracings/viewTraicing', { reporte });
    }
});

router.get('/table/check/:no_control/:id_conv/:no_repor', async (req, res) => {
    const { no_control, id_conv, no_repor } = req.params;
    const reporE = await pool.query('SELECT * FROM reportes_C_A WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
    const reporF = await pool.query('SELECT * FROM reportes_C_D WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
    if (reporE.length > 0) {
        const reporte = {
            fecha_rea: formatDate(reporE[0].fecha_rea),
            no_control: reporE[0].no_control,
            nombre: reporE[0].nombre,
            apellido_p: reporE[0].apellido_p,
            apellido_m: reporE[0].apellido_m,
            carrera: reporE[0].carrera,
            titulo: reporE[0].titulo,
            descripcion: reporE[0].descripcion,
            estado: 'Revisado'
        }
        await pool.query('UPDATE reportes_C_A set ? WHERE id_repor = ?', [reporte, reporE[0].id_repor]);
        res.redirect('/');
    } else if (reporF.length > 0) {
        const reporte = {
            fecha_rea: formatDate(reporF[0].fecha_rea),
            no_control: reporF[0].no_control,
            nombre: reporF[0].nombre,
            apellido_p: reporF[0].apellido_p,
            apellido_m: reporF[0].apellido_m,
            departamento: reporF[0].departamento,
            titulo: reporF[0].titulo,
            descripcion: reporF[0].descripcion,
            estado: 'Revisado'
        }
        await pool.query('UPDATE reportes_C_D set ? WHERE id_repor = ?', [reporte, reporE[0].id_repor]);
        res.redirect('/');
    }
});

router.post('/movil/save/report', async (req, res) => {
    const { fecha_rea, no_control, nombre, apellido_p, apellido_m, carrera, id_conv, titulo, descripcion, no_repor, estado } = req.body;
    const user = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const user2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    console.log(req.body);
    if (user.length > 0) {
        const repor1 = await pool.query('SELECT * FROM guardado_reportes_C_A WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
        if (repor1.length > 0) {
            const report = {
                fecha_rea,
                nombre,
                no_control,
                apellido_p,
                apellido_m,
                carrera,
                id_conv,
                titulo,
                descripcion,
                no_repor,
                estado
            };
            await pool.query('UPDATE guardado_reportes_C_A SET ? WHERE id_repor = ?', [report, repor1[0].id_repor]);
        } else {
            const report = {
                fecha_rea,
                nombre,
                no_control,
                apellido_p,
                apellido_m,
                carrera,
                id_conv,
                titulo,
                descripcion,
                no_repor,
                estado
            };
            await pool.query('INSERT INTO guardado_reportes_C_A SET ?', [report]);
        }
    } else if (user2.length > 0) {
        const repor1 = await pool.query('SELECT * FROM guardado_reportes_C_D WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
        if (repor1.length > 0) {
            const report = {
                fecha_rea,
                nombre,
                no_control,
                apellido_p,
                apellido_m,
                departamento: carrera,
                id_conv,
                titulo,
                descripcion,
                no_repor,
                estado
            };
            await pool.query('UPDATE guardado_reportes_C_D SET ? WHERE id_repor = ?', [report, repor1[0].id_repor]);
        } else {
            const report = {
                fecha_rea,
                nombre,
                no_control,
                apellido_p,
                apellido_m,
                departamento: carrera,
                id_conv,
                titulo,
                descripcion,
                no_repor,
                estado
            };
            await pool.query('INSERT INTO guardado_reportes_C_D SET ?', [report]);
        }
    }
});

router.get('/movil/save/:no_control/:id_conv/:no_repor', async (req, res) => {
    const { no_control, id_conv, no_repor } = req.params;
    console.log(req.params);
    const reporA = await pool.query('SELECT * FROM guardado_reportes_C_A WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
    const reporB = await pool.query('SELECT * FROM guardado_reportes_C_D WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
    const reporE = await pool.query('SELECT * FROM reportes_C_A WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
    const reporF = await pool.query('SELECT * FROM reportes_C_D WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
    if (reporA.length > 0) {
        const report = {
            no_control,
            id_conv,
            no_repor,
            descripcion: reporA[0].descripcion,
            mensaje: 'Reporte encontrado'
        }
        res.json(report);
    } else if (reporB.length > 0) {
        const report = {
            no_control,
            id_conv,
            no_repor,
            descripcion: reporB[0].descripcion,
            mensaje: 'Reporte encontrado'
        }
        res.json(report);
    } else if (reporE.length > 0) {
        const report = {
            no_control,
            id_conv,
            no_repor,
            descripcion: reporE[0].descripcion,
            mensaje: 'Reporte enviado'
        }
        res.json(report);
    } else if (reporF.length > 0) {
        const report = {
            no_control,
            id_conv,
            no_repor,
            descripcion: reporF[0].descripcion,
            mensaje: 'Reporte enviado'
        }
        res.json(report);
    } else {
        const report = {
            no_control,
            id_conv,
            no_repor,
            descripcion: '',
            mensaje: 'Reporte no encontrado'
        }
        res.json(report);
    }
    console.log(reporA);
    console.log(reporB);
});

router.post('/movil/add/report', async (req, res) => {
    const { fecha_rea, no_control, nombre, apellido_p, apellido_m, carrera, id_conv, titulo, descripcion, no_repor, estado } = req.body;
    const user = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const user2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    console.log(req.body);
    if (user.length > 0) {
        const report = {
            fecha_rea,
            no_control,
            nombre,
            apellido_p,
            apellido_m,
            carrera,
            id_conv,
            titulo,
            descripcion,
            no_repor,
            estado
        }
        const reportA = await pool.query('SELECT * FROM guardado_reportes_C_A WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
        if (reportA.length > 0) {
            await pool.query('DELETE FROM guardado_reportes_C_A WHERE id_repor = ?', [reportA[0].id_repor]);
            await pool.query('INSERT INTO reportes_C_A SET ?', [report]);
        } else {
            await pool.query('INSERT INTO reportes_C_A SET ?', [report]);
        }
    } else if (user2.length > 0) {
        const report = {
            fecha_rea,
            no_control,
            nombre,
            apellido_p,
            apellido_m,
            departamento: carrera,
            id_conv,
            titulo,
            descripcion,
            no_repor,
            estado
        }
        const reportB = await pool.query('SELECT * FROM guardado_reportes_C_D WHERE no_control = ? AND id_conv = ? AND no_repor = ?', [no_control, id_conv, no_repor]);
        if (reportB.length > 0) {
            await pool.query('DELETE FROM guardado_reportes_C_D WHERE id_repor = ?', [reportB[0].id_repor]);
            await pool.query('INSERT INTO reportes_C_D SET ?', [report])
        } else {
            await pool.query('INSERT INTO reportes_C_D SET ?', [report])
        }
    }
});

router.get('/movil/activity/report/:no_control', async (req, res) => {
    const { no_control } = req.params;
    let activities = [];
    const user = await pool.query('SELECT * FROM users_alumnos WHERE no_control = ?', [no_control]);
    const user2 = await pool.query('SELECT * FROM users_docentes WHERE no_control = ?', [no_control]);
    if (user.length > 0) {
        const activity = await pool.query('SELECT * FROM aceptados_C_A WHERE no_control = ?', [no_control]);
        console.log(activity)
        for (var i = 0; i < activity.length; i++) {
            const acep = await pool.query('SELECT * FROM convocatorias WHERE id_conv = ?', [activity[i].id_conv]);
            console.log(acep);
            const act = {
                id_conv: acep[0].id_conv,
                titulo: acep[0].titulo,
                fecha_ini_repo: formatDate(acep[0].fecha_ini_repo),
                fecha_fin_repo: formatDate(acep[0].fecha_fin_repo)
            }
            console.log(act)
            activities.push(act);
            console.log(activities)
        }
        res.json(activities);
    } else if (user2.length > 0) {
        const activity = await pool.query('SELECT * FROM aceptados_C_D WHERE no_control = ?', [no_control]);
        console.log(activity.length)
        for (var i = 0; i < activity.length; i++) {
            const acep = await pool.query('SELECT * FROM convocatorias WHERE id_conv = ?', [activity[i].id_conv]);
            const act = {
                id_conv: acep[0].id_conv,
                titulo: acep[0].titulo,
                fecha_ini_repo: formatDate(acep[0].fecha_ini_repo),
                fecha_fin_repo: formatDate(acep[0].fecha_fin_repo)
            }
            console.log(i)
            activities.push(act);
        }
        console.log(activities)
        res.json(activities);
    }
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