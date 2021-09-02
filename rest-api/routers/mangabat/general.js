const router = require('express').Router();
const cheerio = require('cheerio');
const { axios } = require('../../tools');

router.get('/', async (req, res) => {
    try {
        const data = await axios.get('https://m.mangabat.com/');
        res.send({ suceess: true, statusCode: data.status, statusMessage: data.statusText });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.get('/search/:query/page/:pagination', async (req, res) => {
    try {
        const query = req.params.query;
        const pagination = req.params.pagination ? req.params.pagination : 1;

        const response = await axios.get(`https://m.mangabat.com/search/manga/${query}?page=${pagination}`);
        const $ = cheerio.load(response.data);

        const mangas = [];
        $('.panel-list-story > .list-story-item').each((i, e) => {
            const info = $(e).find('.item-right');

            const data = {};
            data.title = $(info).find('h3').text().trim();
            data.author = $(info).find('.item-author').text();
            data.thumb = $(e).find('.img-loading').attr('src');
            data.link = {
                url: $(info).find('h3 > a').attr('href'),
                endpoint: `${$(info).find('h3 > a').attr('href')}`.split('/')[3]
            }

            mangas.push(data);
        });

        const navigation = [];
        $('.group-page > a').each((i, e) => {
            navigation.push({
                name: $(e).text().toLowerCase(),
                endpoint: $(e).attr('href') ? `${$(e).attr('href')}`.split('/')[5] : null
            });
        });

        res.send({ success: true, data: { mangas, navigation } });
    } catch (error) {
        res.send({ success: false, message: error.message ? error.message : error });
    }
});

router.get('/comic/:endpoint', async (req, res) => {
    try {
        const manga = req.params.endpoint;
        let response = await axios.get(`https://read.mangabat.com/${manga}`);
        let $ = cheerio.load(response.data);

        if ($('.panel-not-found p:nth-of-type(1)').text() === '404 - PAGE NOT FOUND') {
            response = await axios.get(`https://m.mangabat.com/${manga}`);
            $ = cheerio.load(response.data);
        }

        const data = {};

        const info = $('.story-info-right');
        data.title = $(info).find('h1').text();
        data.alter = $(info).find('.variations-tableInfo').find('tbody > tr:nth-of-type(1) > .table-value').text().split(';');
        data.thumb = $('.info-image').find('img').attr('src');
        data.author = [];
        $(info).find('.variations-tableInfo').find('tbody > tr:nth-of-type(2) > .table-value > a').each((i, e) => {
            data.author.push({
                name: $(e).text(),
                url: $(e).attr('href')
            });
        });
        data.status = $(info).find('.variations-tableInfo').find('tbody > tr:nth-of-type(3) > .table-value').text();
        data.genre = [];
        $(info).find('.variations-tableInfo').find('tbody > tr:nth-of-type(4) > .table-value > a').each((i, e) => {
            data.genre.push({
                name: $(e).text(),
                url: $(e).attr('href')
            });
        });
        data.synopsis = $('.panel-story-info-description').text().trim();
        data.chapters = [];
        $('.row-content-chapter > li').each((i, e) => {
            data.chapters.push({
                name: $(e).find('.chapter-name').text(),
                link: {
                    url: $(e).find('a').attr('href'),
                    endpoint: `${$(e).find('a').attr('href')}`.split('/')[3]
                }
            });
        });



        res.send({ success: true, data });
    } catch (error) {
        res.send({ success: false, message: error.message ? error.message : error });
    }
});


module.exports = router;