const axios = require('axios').default;
const tough = require('tough-cookie');
const baseURL = 'https://komikindo.id/';
const cookieJar = new tough.CookieJar();
const PDFDocument = require('pdfkit');
const getStream = require('get-stream');
const fs = require('fs');
const https = require('https');

axios.defaults.baseURL = baseURL;
axios.defaults.jar = cookieJar;


// Create a document
module.exports = {
    axios: {
        get: (url, option = {}) => {
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
    generatePDF: async (images) => {
        try {
            const doc = new PDFDocument({ autoFirstPage: false });

            for (const image of images) {
                if (image.endsWith(".gif")) continue;
                const buffer = await require('got')(image).buffer();
                const img = doc.openImage(buffer);
                doc.addPage({ size: [img.width, img.height] });
                doc.image(img, 0, 0);
            };

            doc.end();

            const pdfStream = await getStream.buffer(doc);

            return pdfStream;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};