const express = require("express");
let cors = require("cors");
const createError = require('http-errors');
require('dotenv').config();

const dbUtil = require('./modules/db/module').dbUtil;
dbUtil.init();

const port = process.env.Port;
const fs = require('fs');
const { indexRecords } = require("./util/indexer");

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json({lmit: 50000000}));
app.use(express.urlencoded({ extended: false }));

const recordsModule = require('./modules/records/module')();
const oauthModule = require('./modules/oauth/module')();
const manifetsModule = require('./modules/manifest/module')();

app.use('/get-records', recordsModule.controller);
app.use('/auth', oauthModule.controller);
app.use('/manifest', manifetsModule.controller);

app.get('/test', async (req, res) => {
  const data = await indexRecords();
  res.status(200).send(data);
});

app.use(function (req, res, next) {
	next(createError(404));
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});