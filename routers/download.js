const router = require('express').Router();
const { axios, generatePDF } = require('../tools');

router.get('/:query', async function (req, res, next) {
    const response = await axios.get('http://localhost:3000/api/chapter/' + req.params.query);
    const request = response.data;

    const images = request.data.chapter_images;
    const pdfStream = await generatePDF(images);

    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfStream),
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment;filename=${req.params.query.replace('/', '')}.pdf`,
    })
        .end(pdfStream);
});

module.exports = router;