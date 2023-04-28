'use strict';

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const readExcel = require('read-excel-file/node');
const session = require('express-session');
const excelReadWrite = require('exceljs');


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use(session({
	secret: 'AnupamSessionSecret',
	resave: true,

	saveUninitialized: true
}));

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/html/index.html'));
	//__dirname : It will resolve to your project folder.
});

//add the router
app.use('/', router);
app.use('/public', express.static(__dirname + '/public'));




console.log('Running at Port 5000');


module.exports = app;