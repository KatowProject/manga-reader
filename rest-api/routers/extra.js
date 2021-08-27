const router = require('express').Router();
const { axios } = require('../tools');

router.post('/tojson', async (req, res) => {
    try {
        const body = req.body;
        const jsons = JSON.stringify(body);
        const tojson = JSON.parse(jsons);

        console.log(tojson);
        res.json(tojson);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;