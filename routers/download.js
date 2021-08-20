const router = require('express').Router();
const { axios } = require('../tools');
const PDFDocument = require('pdfkit');

router.get('/:query', async function (req, res, next) {
    const response = await axios.get('http://localhost:3000/api/chapter/' + req.params.query);
    const request = response.data;

    const doc = new PDFDocument({ bufferPages: true, autoFirstPage: false });

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {

        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-disposition': `attachment;filename=${req.params.query.replace('/', '')}.pdf`,
        })
            .end(pdfData);

    });

    for (const image of request.data.chapter_images) {
        if (image.endsWith(".gif")) continue;
        const buffer = await require('got')(image).buffer();
        const img = doc.openImage(buffer);
        doc.addPage({ size: [img.width, img.height] });
        doc.image(img, 0, 0);
    };

    doc.end();
});

module.exports = router;