require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const FilesRouter = require('src/components/file/Files.js');

const { PORT } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res, next) => {
    res.status(200).send({ status: 'Ok' });
});

app.use('/files', FilesRouter);

app.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
});
