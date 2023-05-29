'use strict';

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const session = require('express-session');
const mysql = require('mysql2');
const request = require('request');
const subGraphURL='https://travel-recommendation-engine-hackathon2023-prometheus.mycluster-wdc04-b3c-16x64-bcd9381b2e59a32911540577d00720d7-0000.us-east.containers.appdomain.cloud/getSubGraph';
const fullGraphURL='https://travel-recommendation-engine-hackathon2023-prometheus.mycluster-wdc04-b3c-16x64-bcd9381b2e59a32911540577d00720d7-0000.us-east.containers.appdomain.cloud/getFullGraph';
const recomondationURL='https://travel-recommendation-engine-hackathon2023-prometheus.mycluster-wdc04-b3c-16x64-bcd9381b2e59a32911540577d00720d7-0000.us-east.containers.appdomain.cloud/getRecommendations';




app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

const mySQLConnection = mysql.createConnection({
	host: "mysql-hackathon2023-prometheus.mycluster-wdc04-b3c-16x64-bcd9381b2e59a32911540577d00720d7-0000.us-east.containers.appdomain.cloud",
	port: 32350,
	user: "user",
	password: "pass",
	database: "opdb"
});

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
router.get('/graph', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/html/graph.html'));
	//__dirname : It will resolve to your project folder.
});

router.post('/getSessionMessage', function(req, res) {
	var sessionKeyValue = req.body.sessionKey;
	var valueToBeRetruned = '';
	if (sessionKeyValue == 'firstPageError') {
		var unAuthAccessMessage = req.session.unAuthAccess;
		var loginIssueMessage = req.session.loginIssue;
		if (unAuthAccessMessage != undefined) {
			message = unAuthAccessMessage;
			req.session.unAuthAccess = undefined;
		}
		if (loginIssueMessage != undefined) {
			message = loginIssueMessage;
			req.session.password = undefined;
		}

		valueToBeRetruned = { 'message': message, 'type': ' Error' };
	} else if (sessionKeyValue == 'firstPageInfo') {

		var message = '';
		var registerMessage = req.session.register;
		var passwordMessage = req.session.password;
		var logoutMessage = req.session.logout;

		if (registerMessage != undefined) {
			message = registerMessage;
			req.session.register = undefined;
		}
		if (passwordMessage != undefined) {
			message = passwordMessage;
			req.session.password = undefined;
		}
		if (logoutMessage != undefined) {
			message = logoutMessage;
			req.session.logout = undefined;
		}
		valueToBeRetruned = { 'message': message, 'type': ' Message' };
	}


	res.send(valueToBeRetruned);
});
router.post('/loginUser', function(req, res) {

	var userName = req.body.userName;
	var password = req.body.password;
	var isError = false;
	var userSearchResult = null;
	var callStatus = null;
	mySQLConnection.connect(function(err) {
		if (err) {
			isError = true;
			callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };

			res.send(callStatus);
		}
		mySQLConnection.query("select * from tr_traveller where username='" + userName + "' AND password='" + password + "'", function(err, result, fields) {
			if (err) {
				isError = true;
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };

				res.send(callStatus);
			}

			userSearchResult = result;
			if (isError) {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };
			} else {


				if (userSearchResult != null) {
					if (userSearchResult.length == 1) {
						req.session.loggedInUser = userSearchResult[0].firstname + ' ' + userSearchResult[0].lastname;
						req.session.loggedInUserId = userSearchResult[0].traveller_id;

						callStatus = { 'status': 'success' };
					} else {
						callStatus = { 'status': 'error', 'errorMsg': 'User Name or Password does not match.' };
					}
				} else {

				}

			}



			res.send(callStatus);
		});
	});


});
router.post('/searchUserDetails', function(req, res) {

	var userName = req.body.userName;
	var isError = false;
	var userSearchResult = null;
	var callStatus = null;
	mySQLConnection.connect(function(err) {
		if (err) {
			isError = true;
			callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };

			res.send(callStatus);
		}
		mySQLConnection.query("select * from opdb.tr_traveller where username='" + userName + "'", function(err, result, fields) {
			if (err) {
				isError = true;
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };

				res.send(callStatus);
			}

			userSearchResult = result;
			if (isError) {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };
			} else {

				if (userSearchResult != null) {
					if (userSearchResult.length == 1) {
						callStatus = { 'status': 'success', 'question': userSearchResult[0].secretques, 'answer': userSearchResult[0].secretans, 'id': userSearchResult[0].traveller_id };
					} else {
						callStatus = { 'status': 'error', 'errorMsg': 'User Name does not exist.' };
					}
				} else {

				}

			}



			res.send(callStatus);
		});
	});


});

router.post('/passwordChange', function(req, res) {
	var newPassword = req.body.newPassword;
	var id = req.body.id;

	var callStatus = null;
	mySQLConnection.connect(function(err) {
		if (err) {
			callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.Please try again after some time.' };
			res.send(callStatus);
		}
		var sql = "UPDATE opdb.tr_traveller SET password = '" + newPassword + "' WHERE traveller_id =" + id;
		mySQLConnection.query(sql, function(err, result) {
			if (err) {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.Please try again after some time.' };
				res.send(callStatus);
			}
			if (result != undefined) {
				if (result.affectedRows == 1) {
					callStatus = { 'status': 'success' }
					req.session.password = "Your password has been successfully updated.";
					res.send(callStatus);
				} else {
					callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.Please try again after some time.' };
					res.send(callStatus);
				}
			} else {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.Please try again after some time.' };
				res.send(callStatus);
			}

		});
	});


});

router.post('/getUserInterestList', function(req, res) {


	var isError = false;
	var userInterestsList = null;
	var callStatus = null;
	mySQLConnection.connect(function(err) {
		if (err) {
			isError = true;
			callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };

			res.send(callStatus);
		}
		mySQLConnection.query("select * from opdb.tr_list_interests", function(err, result, fields) {
			if (err) {
				isError = true;
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };

				res.send(callStatus);
			}

			userInterestsList = result;
			if (isError) {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };
			} else {


				callStatus = { 'status': 'success', 'interests': userInterestsList };
			}



			res.send(callStatus);
		});
	});


});

router.post('/avaiableUserId', function(req, res) {


	var isError = false;
	var avaiableUserId = null;
	var callStatus = null;
	mySQLConnection.connect(function(err) {
		if (err) {
			isError = true;
			callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };

			res.send(callStatus);
		}
		mySQLConnection.query("SELECT MAX(traveller_id)+1 AS AVAILABLEID FROM opdb.tr_traveller", function(err, result, fields) {
			if (err) {
				isError = true;
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };

				res.send(callStatus);
			}

			avaiableUserId = result;
			if (isError) {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };
			} else {


				callStatus = { 'status': 'success', 'avaiableUserId': avaiableUserId };
			}



			res.send(callStatus);
		});
	});


});
router.post('/registerUser', function(req, res) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var userName = req.body.userName;
	var password = req.body.password;
	var secretQues = req.body.secretQues;
	var sectAnswer = req.body.sectAnswer;
	var userGender = req.body.userGender;
	var dateOfBirth = req.body.dateOfBirth;
	var avaiableUserId = req.body.avaiableUserId;
	var userAlreadyExsits = false;
	var callStatus = null;

	mySQLConnection.connect(function(err) {
		if (err) {
			callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.Please try after some time' };

			res.send(callStatus);
		}
		var dateOfBirthDate = new Date(dateOfBirth);
		var dateOfBirthString = dateOfBirthDate.getFullYear() + "-" + (dateOfBirthDate.getMonth() + 1) + "-" + dateOfBirthDate.getDate();

		var sql = "INSERT INTO opdb.tr_traveller VALUES (" + avaiableUserId + ",'" + firstName + "','" + lastName + "','" + userName + "','" + password + "','" + secretQues + "','" + sectAnswer + "','" + userGender + "','" + dateOfBirthString + "')";

		mySQLConnection.query(sql, function(err, result) {

			if (err) {
				if (err.code = 'ER_DUP_ENTRY') {
					callStatus = { 'status': 'error', 'errorMsg': 'The user name already exists in the system.Please use another user name' };
				} else {
					callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.Please try after some time.' };
				}



				res.send(callStatus);

			} else {
				callStatus = { 'status': 'success' };

				res.send(callStatus);
			}

		});
	});

});

router.post('/registerInterests', function(req, res) {
	var avaiableUserId = req.body.avaiableUserId;
	var selectedInterest = req.body.selectedInterest;

	var callStatus = null;

	mySQLConnection.connect(function(err) {
		if (err) {
			callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.Please try after some time' };

			res.send(callStatus);
		}

		var sql = "";
		var insertData = "";
		for (var i = 0; i < selectedInterest.length; i++) {
			if (insertData == "") {
				insertData = insertData + "(" + avaiableUserId + ",'" + selectedInterest[i] + "')";
			} else {
				insertData = insertData + ", (" + avaiableUserId + ",'" + selectedInterest[i] + "')";
			}

		}
		sql = "INSERT INTO opdb.tr_traveller_interest VALUES " + insertData;
		
		mySQLConnection.query(sql, function(err, result) {
			
			if (err) {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.Please try after some time.' };
				res.send(callStatus);

			} else {
				req.session.register = "You have successfully register the user.";
				callStatus = { 'status': 'success' };

				res.send(callStatus);
			}

		});
	});

});
router.post('/populateLoginData', function(req, res) {
	var callStatus = null;
	var listOfFeatures = null;
	var listOfInterests = null;

	if (req.session.loggedInUserId == undefined) {
		callStatus = { 'status': 'error' };
		req.session.unAuthAccess = "You are not logged in yet.First You should login to access the application.";

		res.send(callStatus);
	} else {
		mySQLConnection.connect(function(errFeature) {
			if (errFeature) {

				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };

				res.send(callStatus);
			}
			mySQLConnection.query("SELECT * from opdb.tr_list_feature", function(errFeature, resultFeature, fields) {
				if (errFeature) {
					callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };
					res.send(callStatus);
				}
				listOfFeatures = resultFeature;

				mySQLConnection.connect(function(errInterest) {
					if (errInterest) {

						callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue.' };

						res.send(callStatus);
					}
					mySQLConnection.query("SELECT * FROM opdb.tr_traveller_interest where traveller_id=" + req.session.loggedInUserId, function(errInterest, resultInterset, fields) {
						if (errInterest) {
							callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };
							res.send(callStatus);
						}
						listOfInterests = resultInterset;
						callStatus = { 'userName': req.session.loggedInUser, 'listOfFeatures': listOfFeatures, 'listOfInterests': listOfInterests };
						res.send(callStatus);
					});
				});
			});
		});





	}



});
router.post('/getRecomondation', function(req, res) {
	var recomondationInputList = req.body.recomondationList;

	request.post({
		headers: { 'content-type': 'application/json' },
		url:recomondationURL ,
		body: recomondationInputList,
		json: true
	}, function(error, response, body) {
		var callStatus = null;
		if (error != null) {
			callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };

		} else {
			callStatus = { 'status': 'success', 'listOfRecomondation': body };
		}


		res.send(callStatus);
	});

});
router.post('/logoutUser', function(req, res) {
	req.session.loggedInUser = undefined;
	req.session.loggedInUserId = undefined;
	var finalResponse = '';
	if (req.session.loggedInUser == undefined) {
		finalResponse = { status: 'success' };
		req.session.logout = 'You have been successfully logged out.';
	} else {
		finalResponse = { 'status': 'error', 'errorMessage': 'There is some technical issue.Please try after some time.' }
	}
	res.send(finalResponse);
});

router.post('/openGraph', function(req, res) {
	var graphInput = req.body.graphInput;
	var graphType = req.body.graphType;
	

	if (graphType == 'fullGraph') {

		request.get({
			headers: { 'content-type': 'application/json' },
			url: fullGraphURL,
			json: true
		}, function(error, response, body) {
			var callStatus = null;

			if (error != null) {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };

			} else {
				
				callStatus = { 'status': 'success', 'graphData': body };
			}


			res.send(callStatus);
		});

	} else if (graphType == 'rowGraph') {
		request.post({
			headers: { 'content-type': 'application/json' },
			url: subGraphURL,
			body: JSON.parse(graphInput),
			json: true
		}, function(error, response, body) {
			var callStatus = null;

			if (error != null) {
				callStatus = { 'status': 'error', 'errorMsg': 'There is some technical issue in retriving the information.' };

			} else {
				
				callStatus = { 'status': 'success', 'graphData': body };
			}


			res.send(callStatus);
		});
	}


});
//add the router
app.use('/', router);
app.use('/public', express.static(__dirname + '/public'));




console.log('Running at Port 8000');


module.exports = app;