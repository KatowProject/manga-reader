const router = require('express').Router();
const cheerio = require('cheerio');
const { axios, getVideoSrc } = require('../../tools');
const mainUrl = 'https://otakudesu.vip';

router.get('/detail/:endpoint', async (req, res) => {
    try {
        const endpoint = req.params.endpoint;
        const url = `${mainUrl}/anime/${endpoint}`;

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const main = $('#venkonten');

        const obj = {};
        obj.main_title = $(main).find('.jdlrx > h1').text().trim();
        obj.thumb = $(main).find('.wp-post-image').attr('src');
        obj.title = $(main).find('.infozingle > p:nth-of-type(1)').text().split(':')[1].trim();
        obj.japanese = $(main).find('.infozingle > p:nth-of-type(2)').text().split(':')[1].trim();
        obj.skor = $(main).find('.infozingle > p:nth-of-type(3)').text().split(':')[1].trim();
        obj.producer = $(main).find('.infozingle > p:nth-of-type(4)').text().split(':')[1].trim();
        obj.type = $(main).find('.infozingle > p:nth-of-type(5)').text().split(':')[1].trim();
        obj.status = $(main).find('.infozingle > p:nth-of-type(6)').text().split(':')[1].trim();
        obj.episodes = $(main).find('.infozingle > p:nth-of-type(7)').text().split(':')[1].trim();
        obj.duration = $(main).find('.infozingle > p:nth-of-type(8)').text().split(':')[1].trim();
        obj.release_date = $(main).find('.infozingle > p:nth-of-type(9)').text().split(':')[1].trim();
        obj.studio = $(main).find('.infozingle > p:nth-of-type(10)').text().split(':')[1].trim();
        obj.genre = $(main).find('.infozingle > p:nth-of-type(11)').text().split(':')[1].trim();
        obj.sinopsis = [];
        $(main).find('.sinopc > p').each((i, el) => obj.sinopsis.push($(el).text().trim()));
        obj.eps = [];
        $(main).find('.episodelist').each((i, el) => {
            const type = $(el).find('.monktit').text();
            switch (true) {
                case type.includes('Lengkap'):
                    obj.eps.push({
                        type: 'Lengkap',
                        title: $(el).find('span > a').text(),
                        url: $(el).find('span > a').attr('href'),
                        endpoint: `${$(el).find('span > a').attr('href')}`.replace(mainUrl, ''),
                    });
                    break;

                case type.includes('Batch'):
                    const tit = $(el).find('span > a').text();
                    if (!tit.includes('[BATCH]')) return;
                    obj.eps.push({
                        type: 'Batch',
                        title: $(el).find('span > a').text(),
                        url: $(el).find('span > a').attr('href'),
                        endpoint: `${$(el).find('span > a').attr('href')}`.replace(mainUrl, ''),
                    });
                    break;

                case type.includes('List'):
                    const temp = [];
                    $(el).find('ul > li').each((b, j) => {
                        temp.push({
                            title: $(j).find('a').text(),
                            url: $(j).find('a').attr('href'),
                            endpoint: $(j).find('a').attr('href').replace(mainUrl, ''),
                        });
                    });
                    obj.eps.push({
                        type: 'List',
                        data: temp,
                    });
                    break;
            }
        });


        res.send({ success: true, data: obj });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, error: err.message });
    }
});

router.get('/batch/:endpoint', async (req, res) => {
    try {
        const endpoint = req.params.endpoint;
        const url = `${mainUrl}/batch/${endpoint}`;

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const main = $('.download');

        const obj = {};
        obj.title = $(main).find('.batchlink > h4').text();
        obj.download_link = [];
        $(main).find('.batchlink ul li').each((i, a) => {
            const temp = [];
            $(a).find('a').each((j, b) => {
                temp.push({
                    name: $(b).text(),
                    url: $(b).attr('href'),
                });
            });
            obj.download_link.push({
                name: $(a).find(`strong`).text(),
                data: temp
            });
        });

        res.send({ success: true, data: obj });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, error: err.message });
    }
});

router.get('/eps/:endpoint', async (req, res) => {
    try {
        const endpoint = req.params.endpoint;
        const query = req.query;

        const mirror = Object.keys(query);
        const url = `${mainUrl}/${endpoint}?${mirror[0]}=${query[mirror[0]]}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const main = $('#venkonten');

        const obj = {};
        obj.title = $(main).find('.venutama > .posttl').text().trim();
        obj.eps_list = [];
        $(main).find('#selectcog > option').each((i, a) => {
            const url = $(a).attr('value');
            obj.eps_list.push({
                title: $(a).text(),
                url: url,
                endpoint: url.replace(mainUrl, ''),
            });
        });
        obj.all_eps = {
            name: $(main).find('.flir > a:nth-of-type(1)').text(),
            url: $(main).find('.flir > a:nth-of-type(1)').attr('href'),
            endpoint: $(main).find('.flir > a:nth-of-type(1)').attr('href')?.replace(mainUrl, ''),
        }
        obj.next_eps = {
            name: $(main).find('.flir > a:nth-of-type(2)').text(),
            url: $(main).find('.flir > a:nth-of-type(2)').attr('href'),
            endpoint: $(main).find('.flir > a:nth-of-type(2)').attr('href')?.replace(mainUrl, ''),
        }
        const stream_link = $(main).find('#lightsVideo').find('iframe').attr('src');
        if (!stream_link) obj.stream_link = '-';

        if (stream_link.includes('.html')) {
            obj.stream_link = stream_link;
        } else if (stream_link.includes('gdriveplayer')) {
            obj.stream_link = stream_link;
        } else if (stream_link.includes('yourupload')) {
            obj.stream_link = stream_link;
        } else if (stream_link.includes('mega')) {
            obj.stream_link = stream_link;
        } else obj.stream_link = await getVideoSrc(stream_link);

        obj.mirror_stream_link = [];
        $(main).find('.mirrorstream > ul').each((i, a) => {
            const temp = [];
            const iClass = $(a).attr('class');

            switch (true) {
                case iClass.includes('480'):
                    $(a).find('li').each((j, b) => {
                        temp.push({
                            title: $(b).find('a').text().trim(),
                            url: $(b).find('a').attr('href'),
                        });
                    });

                    obj.mirror_stream_link.push({
                        name: '480p',
                        data: temp,
                    });
                    break;

                case iClass.includes('720'):
                    $(a).find('li').each((j, b) => {
                        temp.push({
                            title: $(b).find('a').text(),
                            url: $(b).find('a').attr('href'),
                        });
                    });

                    obj.mirror_stream_link.push({
                        name: '720p',
                        data: temp,
                    });
                    break;
            }
        });
        obj.download_link = [];
        $(main).find('.download > ul > li').each((i, a) => {
            const temp = [];
            $(a).find('a').each((j, b) => {
                temp.push({
                    title: $(b).text(),
                    url: $(b).attr('href'),
                });
            });
            obj.download_link.push({
                name: $(a).find('strong').text(),
                data: temp,
                i: `link-${i + 1}`
            });
        });

        res.send({ success: true, data: obj });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, error: err.message });
    }
});


module.exports = router;