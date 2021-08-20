const router = require('express').Router();
const cheerio = require('cheerio');
const { axios } = require('../tools');

router.get('/:query', async (req, res) => {
    try {
        const response = await axios.get(`${req.params.query}`);
        const $ = cheerio.load(response.data);
        const main = $('#chimg');

        const data = {};
        data.chapter_name = $('h1.entry-title').text().replace('Komik ', '').trim();
        data.chapter_url = `https://komikindo.id/${req.params.query}/`;
        data.chapter_endpoint = `${req.params.query}/`;
        data.chapter_images = [];
        $(main).find('img').each((i, e) => {
            const image = $(e).attr('src');
            data.chapter_images.push(image);
        });
        data.chapter_length = data.chapter_images.length;
        data.download_link = {
            zip: `https://posantai.bugs.today/komikindo/download/${req.params.query}/zip`,
            pdf: `https://posantai.bugs.today/komikindo/download/${req.params.query}/pdf`,
        };

        res.send({ success: true, data });
    } catch (error) {
        res.send({ success: false, error: error.message });
    }

});
module.exports = router;