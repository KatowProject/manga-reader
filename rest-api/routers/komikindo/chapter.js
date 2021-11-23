const router = require('express').Router();
const cheerio = require('cheerio');
const { axios } = require('../../tools');

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
            const img = image.replace("img.statically.io/img/bacakomik/", "")
            data.chapter_images.push(`https://cdn.iqbalrifai.eu.org/iu/?url=${img}`);
        });
        data.chapter_length = data.chapter_images.length;

        const nav = $('.navig > .nextprev');
        data.chapter = {
            previous: $(nav).find('[rel=prev]').attr('href') ? $(nav).find('[rel=prev]').attr('href').replace('https://komikindo.id/', '') : null,
            next: $(nav).find('[rel=next]').attr('href') ? $(nav).find('[rel=next]').attr('href').replace('https://komikindo.id/', '') : null,
        }

        data.download_link = {
            pdf: `http://205.185.113.50/komik/download/${req.params.query}`,
        };

        res.send({ success: true, data });
    } catch (error) {
        res.send({ success: false, error: error.message });
    }
});
module.exports = router;