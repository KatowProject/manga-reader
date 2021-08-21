/* Module */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

/* ============ */
const PORT = process.env.PORT || 3000;
const general = require('./routers/general');
const link = require('./routers/chapter');
const download = require('./routers/download');

const app = express();
app.use(cors());
app.use(helmet());
app.use('/download', download);
app.use('/', general);
app.use('/chapter', link);
app.use(express.static('public'));

/* Status */
app.use('/', async (req, res) => {
    res.send({
        status: true,
        message: 'Komikindo',
        repo: 'KatowProject'
    });
});

app.use('*', async (req, res) => {
    res.status(404).send({ status: false, message: 'api not found' });
});

/* Listener */
app.listen(PORT, async () => {
    console.log('Listening on PORT ' + PORT);
});
