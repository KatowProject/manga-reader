/* Module */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

/* ============ */
const PORT = process.env.PORT || 4873;

/*---*/
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static('public'));


/* Path */
app.use('/api/account', require('./routers/account'));

app.use('/komikindo/download', require('./routers/komikindo/download'));
app.use('/komikindo/api', require('./routers/komikindo/general'));
app.use('/komikindo/api/chapter', require('./routers/komikindo/chapter'));

app.use('/mangabat/api', require('./routers/mangabat/general'));
app.use('/mangabat/api/chapter', require('./routers/mangabat/chapter'));
app.use('/mangabat/download', require('./routers/mangabat/download.js'));

app.use('*', async (req, res) => {
    res.status(404).send({ status: false, message: 'api not found' });
});

/* Listener */
app.listen(PORT, async () => {
    console.log('Listening on PORT ' + PORT);
});
