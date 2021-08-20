const axios = require('axios').default;
const tough = require('tough-cookie');
const baseURL = 'https://komikindo.id/';
const cookieJar = new tough.CookieJar();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

axios.defaults.baseURL = baseURL;
axios.defaults.jar = cookieJar;


// Create a document
module.exports = {
    axios: {
        get: (url) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await axios.get(url);
                    if (res.status === 200) return resolve(res);
                    else reject(res);
                } catch (err) {
                    return reject({ status: false, error: err.message });
                }
            });
        },
        post: (url, data, options = {}) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await axios.post(url, data, options);
                    if (res.status === 200) return resolve(res);
                    else reject(res);
                } catch (err) {
                    return reject({ status: false, error: err.message });
                }
            });
        }
    },
    pdf: async (nameFile, array, res) => {
        const doc = new PDFDocument({ buffersPages: true, autoFirstPage: false });

        for (const image of array) {
            if (image.endsWith(".gif")) continue;
            const buffer = await require('got')(image).buffer();
            const img = doc.openImage(buffer);
            doc.addPage({ size: [img.width, img.height] });
            doc.image(img, 0, 0);
        };

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            res.setHeader('Content-disposition', `attachment; filename=${nameFile}.pdf`);
            res.setHeader('Content-type', 'application/pdf');
            res.setHeader('Content-Length', doc.outputSync().length);
            fs.createReadStream(`${nameFile}.pdf`).pipe(res);
        })
    }
};