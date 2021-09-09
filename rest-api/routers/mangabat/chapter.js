const router = require('express').Router();
const cheerio = require('cheerio');
const { axios } = require('../../tools');

router.get('/:endpoint', async (req, res) => {
    try {
        const manga = req.params.endpoint;
        let response = await axios.get(`https://read.mangabat.com/${manga}`);
        let $ = cheerio.load(response.data);

        if ($('.panel-not-found p:nth-of-type(1)').text() === '404 - PAGE NOT FOUND') {
            response = await axios.get(`https://m.mangabat.com/${manga}`);
            $ = cheerio.load(response.data);
        }

        const data = {};
        data.chapter_title = $('.panel-chapter-info-top > h1').text();
        data.chapter_url = response.config.url;
        data.chapter_endpoint = data.chapter_url.replace('https://read.mangabat.com/', '');
        data.chapter_images = [];
        $('.container-chapter-reader > img').each((i, e) => {
            data.chapter_images.push({
                name: $(e).attr('title'),
                url: $(e).attr('src')
            });
        });
        data.chapter_length = data.chapter_images.length;
        data.navigation = {};
        $('.navi-change-chapter-btn:nth-of-type(1) > a').each((i, e) => {
            if ($(e).text() === 'PREV CHAPTER') {
                data.navigation.prev.url = `${$(e).attr('href')}`.replace('https://read.mangabat.com/', '');
                data.navigation.prev.endpoint = data.navigation.prev.url.split('/').pop();
            } else if ($(e).text() === 'NEXT CHAPTER') {
                data.navigation.next.url = `${$(e).attr('href')}`.replace('https://read.mangabat.com/', '');
                data.navigation.endpoint.endpoint = data.navigation.next.url.split('/').pop();
            }
        });

        res.send({ success: true, data });
    } catch (error) {
        res.send({ success: false, message: error.message ? error.message : error });
    }
})
module.exports = router;

