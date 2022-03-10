const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pageInit/home');
});

module.exports = router;