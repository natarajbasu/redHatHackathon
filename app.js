'use strict';

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const session = require('express-session');



app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use(session({
	secret: 'PrometheusHackathonSessionSecret',
	resave: true,

	saveUninitialized: true
}));

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/html/index.html'));
	//__dirname : It will resolve to your project folder.
});
router.get('/loginPage', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/html/home.html'));
	//__dirname : It will resolve to your project folder.
});
router.get('/forgetPassword', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/html/forgetPassword.html'));
	//__dirname : It will resolve to your project folder.
});
router.get('/register', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/html/register.html'));
	//__dirname : It will resolve to your project folder.
});

//add the router
app.use('/', router);
app.use('/public', express.static(__dirname + '/public'));




console.log('Running at Port 8000');


module.exports = app;