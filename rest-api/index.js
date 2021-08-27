/* Module */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

/* ============ */
const PORT = process.env.PORT || 4873;

/* Backend */
const general = require('./routers/general');
const link = require('./routers/chapter');
const download = require('./routers/download');
const extra = require('./routers/extra');

/*---*/
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.text());
app.use(express.json());
app.use(express.static('public'));


/* Path */
app.use('/download', download);
app.use('/api', general);
app.use('/api/chapter', link);
app.use('/api/extra', extra);


app.use('*', async (req, res) => {
    res.status(404).send({ status: false, message: 'api not found' });
});

/* Listener */
app.listen(PORT, async () => {
    console.log('Listening on PORT ' + PORT);
});
