const router = require('express').Router();
const cheerio = require('cheerio');
const { axios } = require('../tools');

router.get('/', async (req, res) => {
    try {
        const data = await axios.get('/');
        res.send({ suceess: true, statusCode: data.status, statusMessage: data.statusText });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.get('/komik/page/:number', async (req, res) => {
    try {
        const response = await axios.get(`/daftar-komik/page/${req.params.number}`);
        const $ = cheerio.load(response.data);

        const manga = [];
        const main = $('.postbody');
        $(main).find('.film-list > .animepost').each((i, e) => {
            const m = $(e).find('.animposx');
            manga.push({
                title: $(m).find('a').attr('title'),
                thumb: $(m).find('.limit > img').attr('src'),
                link: {
                    endpoint: $(m).find('a').attr('href').replace('https://komikindo.id/', ''),
                    url: $(m).find('a').attr('href')
                }
            });
        })

        res.send({ success: true, data: manga });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    };
});

router.get('/cari/:query', async (req, res) => {
    try {
        const response = await axios.get(`/?s=${req.params.query}`);
        const $ = cheerio.load(response.data);

        const manga = [];
        const main = $('.postbody');
        $(main).find('.film-list > .animepost').each((i, e) => {
            const m = $(e).find('.animposx');
            manga.push({
                title: $(m).find('a').attr('title').replace('Komik ', ''),
                thumb: $(m).find('.limit > img').attr('src').split('?')[0],
                link: {
                    endpoint: $(m).find('a').attr('href').replace('https://komikindo.id/', ''),
                    url: $(m).find('a').attr('href')
                }
            });
        })

        res.send({ success: true, data: manga });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.get('/komik/:endpoint', async (req, res) => {
    try {
        const response = await axios.get(`/manga/${req.params.endpoint}`);
        const $ = cheerio.load(response.data);

        const main = $('.infoanime');
        const info = $(main).find('.spe');
        const manga = {};

        manga.title = $(main).find('.entry-title').text();
        manga.thumb = $(main).find('.thumb > img').attr('src').split('?')[0];
        manga.alter = $(info).find('span:nth-of-type(1)').text().replace('Judul Alternatif: ', '').split(', ');
        manga.status = $(info).find('span:nth-of-type(2)').text().split(':')[1].trim();
        manga.pengarang = [];
        $(info).find('span:nth-of-type(3) > a').each((i, e) => {
            const authors = manga.pengarang;
            authors.push({
                name: $(e).text(),
                link: $(e).attr('href'),
                endpoint: $(e).attr('href').replace('https://komikindo.id/', '')
            });
        });
        manga.illustrator = [];
        $(info).find('span:nth-of-type(4) > a').each((i, e) => {
            const illus = manga.illustrator;
            illus.push({
                name: $(e).text(),
                link: $(e).attr('href'),
                endpoint: $(e).attr('href').replace('https://komikindo.id/', '')
            });
        });
        manga.grafis = {
            name: $(info).find('span:nth-of-type(5)').text().split(': ')[1].trim(),
            link: $(info).find('span:nth-of-type(5) > a').attr('href'),
            endpoint: $(info).find('span:nth-of-type(5) > a').attr('href').replace('https://komikindo.id/', '')
        };
        manga.tema = [];
        $(info).find('span:nth-of-type(6) > a').each((i, e) => {
            const themes = manga.tema;
            themes.push({
                name: $(e).text(),
                link: $(e).attr('href'),
                endpoint: $(e).attr('href').replace('https://komikindo.id/', '')
            });
        });
        manga.tipe = $(info).find('span:nth-of-type(7)').text().split(':')[1].trim();
        manga.genre = [];
        $('.infox').find('.genre-info > a').each((i, e) => {
            const genres = manga.genre;
            genres.push({
                name: $(e).text(),
                link: `https://komikindo.id` + $(e).attr('href'),
                endpoint: $(e).attr('href').replace('https://komikindo.id/', '')
            });
        });
        manga.sinopsis = $('*[itemprop="description"]').text().trim();
        manga.score = $('*[itemprop="ratingValue"]').text();
        manga.chapters = [];
        $('#chapter_list ul > li').each((i, e) => {
            const chapters = manga.chapters;

            const obj = {}
            obj.title = $(e).find('.lchx').text();
            obj.link = $(e).find('.lchx > a').attr('href');
            obj.endpoint = $(e).find('.lchx > a').attr('href').replace('https://komikindo.id/', '');
            obj.download = {
                pdf: `http://posantai.bugs.today/komikindo/api/download/${obj.endpoint}`
            };

            chapters.push(obj);
        });

        res.send({ success: true, data: manga });
    } catch (error) {
        console.log(error);
        res.send({ suceess: false, message: error.message });
    }
});

module.exports = router;