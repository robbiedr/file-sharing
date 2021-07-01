require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require('node-cron');

const FilesRouter = require('routes/Files.js');

const FileCheckerService =  require('src/components/file/checker/FileCheckerService.js');

const { PORT, MONGODB_URL, CHECK_INACTIVITY_INTERVAL } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
    MONGODB_URL,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);

app.get('/healthcheck', (req, res, next) => {
    res.status(200).send({ status: 'Ok' });
});

app.use('/files', FilesRouter);

app.listen(PORT, () => {
    console.log('['+ new Date() + '] ' + 'Listening to port ' + PORT);

    cron.schedule(CHECK_INACTIVITY_INTERVAL, async () => {
        console.log('['+ new Date() + '] ' + `Checking for inactive files...`);
        FileCheckerService.deleteInactiveFiles();
    });
});
