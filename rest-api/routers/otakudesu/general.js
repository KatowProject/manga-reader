const router = require('express').Router();
const { axios } = require('../../tools');
const cheerio = require('cheerio');
const baseURL = 'https://otakudesu.vip';

router.get('/', async (req, res) => {
    try {
        const data = await axios.get('https://m.mangabat.com/');
        res.send({ suceess: true, statusCode: data.status, statusMessage: data.statusText });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.get('/home', async (req, res) => {
    try {
        const response = await axios.get(`${baseURL}/`);
        const $ = cheerio.load(response.data);
        const main = $('.rseries');

        const obj = {};
        obj.ongoing = [];
        $(main).find('.venz > ul > li').each((i, el) => {
            const isOngoing = $(el).find('.epztipe').text().trim();
            if (parseInt(isOngoing)) return;

            obj.ongoing.push({
                name: $(el).find('.jdlflm').text(),
                thumb: $(el).find('.thumbz > img').attr('src'),
                epsisode_name: $(el).find('.epz').text().trim(),
                hari: $(el).find('.epztipe').text().trim(),
                release_date: $(el).find('.newnime').text().trim(),
                url: $(el).find('.thumb > a').attr('href'),
                endpoint: $(el).find('.thumb > a').attr('href').replace(baseURL, '')
            });
        });
        obj.complete = [];
        $(main).find('.rseries').find('.venz > ul > li').each((i, el) => {
            obj.complete.push({
                name: $(el).find('.jdlflm').text(),
                thumb: $(el).find('.thumbz > img').attr('src'),
                epsisode_name: $(el).find('.epz').text().trim(),
                skor: $(el).find('.epztipe').text().trim(),
                release_date: $(el).find('.newnime').text().trim(),
                url: $(el).find('.thumb > a').attr('href'),
                endpoint: $(el).find('.thumb > a').attr('href').replace(baseURL, '')
            });
        });

        res.send({ success: true, data: obj });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: err.message });
    }
});

router.get('/search/:query', async (req, res) => {
    try {
        const endpoint = req.params.query;
        const query = endpoint.replace(/\s/g, '+');
        console.log(query);

        const response = await axios.get(`${baseURL}/?s=${query}&post_type=anime`);
        const $ = cheerio.load(response.data);
        const main = $('#venkonten');

        const data = [];
        $(main).find('.chivsrc li').each((i, el) => {
            const genres = [];
            $(el).find('.set:nth-of-type(1) > a').each((b, ele) => {
                genres.push({
                    name: $(ele).text(),
                    url: $(ele).attr('href'),
                });
            })
            data.push({
                name: $(el).find('h2 > a').text(),
                thumb: $(el).find('img').attr('src'),
                genres,
                status: $(el).find('.set:nth-of-type(2)').text().split(':')[1]?.trim(),
                score: $(el).find('.set:nth-of-type(3)').text().split(':')[1]?.trim(),
                url: $(el).find('h2 > a').attr('href'),
                endpoint: $(el).find('h2 > a').attr('href').replace(baseURL, '')
            });
        });

        res.send({ success: true, data });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: err.message });
    }
});

module.exports = router;