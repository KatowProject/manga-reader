const router = require('express').Router();
const fs = require('fs');
const { axios } = require('../../tools');

router.get('/', async (req, res) => {
    const img = req.query.url;
    console.log(img);
    const image = await axios.get(img, {
        headers: {
            "referer": "https://komikindo.id/"
        }
    })
    const fileContents = Buffer.from(image.data).toString('base64');
    fs.writeFile('./image.png', fileContents, (err) => {
        if (err) return console.error(err)
        console.log('file saved!')
    })

    res.send('ok');
});


module.exports = router;