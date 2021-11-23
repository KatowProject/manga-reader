const router = require('express').Router();
const fs = require('fs');
// const { axios } = require('../../tools');
const axios = require('axios');

router.get('/', async (req, res) => {
    const img = req.query.url;
    console.log(img);
    const image = await axios.get(img);
    const fileContents = Buffer.from(image.data).toString('base64');

    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': fileContents.length
    });

    res.end(fileContents);
});


module.exports = router;