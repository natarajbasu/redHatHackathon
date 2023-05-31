var prometheusHackathonModuleApp = angular.module('prometheusHackathonModuleApp', ['ngRoute']);
prometheusHackathonModuleApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/public/html/index.html',
			controller: 'welcomePageController'
		})
		.when('/loginPage', {
			templateUrl: '/public/html/home.html',
			controller: 'homePageController'
		})
		.when('/forgetPassword', {
			templateUrl: '/public/html/forgetPassword.html',
			controller: 'forgetPasswordPageController'
		})
		.when('/register', {
			templateUrl: '/public/html/register.html',
			controller: 'registrationPageController'
		});
});


prometheusHackathonModuleApp.controller("welcomePageController", function($scope, $http, $window) {
	$http.post('/getSessionMessage', {
		'sessionKey': 'firstPageError'

	}).then(function(response) {

		var dataRetruned = response.data;

		if (dataRetruned.type.trim() == 'Error') {

			$scope.errorMessage = dataRetruned.message;

		}

	});


	$http.post('/getSessionMessage', {
		'sessionKey': 'firstPageInfo'

	}).then(function(response) {
		var dataRetruned = response.data;

		if (dataRetruned.type.trim() == 'Message') {

			$scope.infoMessage = dataRetruned.message;
		}

	});

	$scope.submitMutualFundForm = function() {
		$http.post('/loginUser', {
			userName: $scope.user.userName,
			password: $scope.user.password
		}).then(function(response) {

			var callStatus = response.data;
			if (callStatus.status == 'success') {


				$window.location.href = '/loginPage';
			} else {
				$scope.errorMessage = callStatus.errorMsg;
				$window.location.replace = '/';
			}

		});
	}

});
prometheusHackathonModuleApp.controller("forgetPasswordPageController", function($scope, $http, $window) {

	$scope.searchUserDetails = function() {
		$scope.errorMessage = '';
		$http.post('/searchUserDetails', {
			userName: $scope.forgetPassword.userName
		}).then(function(response) {

			$scope.searchResultDeatils = response.data;
			if ($scope.searchResultDeatils.status == 'success') {
				$scope.secretQuestion = $scope.searchResultDeatils.question;
				$scope.forgetPassword.secretQuesSec = true;
				$scope.forgetPasswordUserNameDisable = true;
				$window.location.relace = '/forgetPassword';
			} else {
				$scope.errorMessage = $scope.searchResultDeatils.errorMsg;
				$window.location.relace = '/forgetPassword';
			}




		});

	};
	$scope.submitAnswer = function() {
		var secretQuesAns = $scope.forgetPassword.secretQuesAns;

		if ($scope.searchResultDeatils.answer.toLowerCase() == secretQuesAns.toLowerCase()) {

			$scope.forgetPassword.changePasswordSec = true;
			$scope.forgetPasswordSecretAnswerDisable = true;
			$window.location.relace = '/forgetPassword';


		} else {
			$scope.errorMessage = 'Your Secret Answer is not Matching.Please enter valid answer';
			$window.location.relace = '/forgetPassword';
		}


	};
	$scope.changePassword = function() {
		var newPassword = $scope.forgetPassword.newPassword.trim();
		var confirmNewPassword = $scope.forgetPassword.confirmNewPassword.trim();

		$scope.errorMessage = '';
		if (newPassword != confirmNewPassword) {
			$scope.errorMessage = 'New Password and Confirm New Password are not matching.Please try again.';
			$window.location.relace = '/forgetPassword';

		} else {

			$http.post('/passwordChange', {
				newPassword: newPassword,
				id: $scope.searchResultDeatils.id
			}).then(function(response) {

				if (response.data.status == 'success') {

					$window.location.href = '/';

				} else {
					$scope.errorMessage = response.data.errorMsg;
					$window.location.relace = '/forgetPassword';
				}

			}).catch(function(error) {
				$scope.errorMessage = 'There is some issue with the Password Reset Process. Please try after some time';
				$window.location.relace = '/forgetPassword';


			});


		}


	};

});
prometheusHackathonModuleApp.controller("registrationPageController", function($scope, $http, $window) {
	$scope.basicInformation = true;
	$scope.selectedInterest = [];
	$scope.selectedInterestBackup = [];
	$scope.chooseInterest = function chooseInterest() {
		$scope.basicInformation = false;
		$scope.userInterestInformation = true;
		$scope.loginInformation = false;

	};
	$scope.loginCredentials = function loginCredentials() {
		$scope.basicInformation = false;
		$scope.userInterestInformation = false;
		$scope.loginInformation = true;
	};
	$scope.enterBasicInformation = function enterBasicInformation() {

		$scope.basicInformation = true;
		$scope.userInterestInformation = false;
		$scope.loginInformation = false;
	};


	$scope.toggleSelection = function toggleSelection(selectedInterest, index, typeEven, typeOdd) {
		var idx = $scope.selectedInterest.indexOf(selectedInterest.interest);
		var idxBK = $scope.selectedInterestBackup.indexOf(selectedInterest.interest);
		var errorUsed = false;


		if (idxBK > -1) {
			var elementName = '';
			if (typeEven) {
				elementName = 'interests_even_' + index;
			} else if (typeOdd) {
				elementName = 'interests_odd_' + index;
			}

			document.getElementById(elementName).checked = false;

			$scope.selectedInterestBackup.splice(idxBK, 1);
			$scope.errorMessage = '';
			errorUsed = true;


		}


		if (idx > -1) {
			$scope.selectedInterest.splice(idx, 1);



		} else {

			if ($scope.selectedInterest.length >= 3) {
				if (!errorUsed) {
					$scope.errorMessage = "Maximum 3 seletions are allowed.";
					var elementName = '';
					if (typeEven) {
						elementName = 'interests_even_' + index;
					} else if (typeOdd) {
						elementName = 'interests_odd_' + index;
					}

					document.getElementById(elementName).checked = false;

				}

				$scope.selectedInterestBackup.push(selectedInterest.interest);
			} else {

				$scope.selectedInterest.push(selectedInterest.interest);
				$scope.selectedInterestBackup.push(selectedInterest.interest);


			}



		}

	};

	$http.post('/getUserInterestList', {

	}).then(function(response) {

		if (response.data.status == 'success') {

			$scope.userInterests = response.data.interests;

		}

	});
	$http.post('/avaiableUserId', {

	}).then(function(response) {

		if (response.data.status == 'success') {

			$scope.avaiableUserId = response.data.avaiableUserId[0].AVAILABLEID;

		}

	});
	$scope.registerUserForm = function() {
		$scope.errorMessage = '';
		$scope.infoMessage = '';
		var errorPresent = false;
		var inputErrorMessage = '';
		var password = $scope.register.password;
		var confirmPassword = $scope.register.confirmPassword;
		var firstName = $scope.register.firstName;
		var lastName = $scope.register.lastName;
		var userName = $scope.register.userName;
		var secretQues = $scope.register.secretQues;
		var sectAnswer = $scope.register.sectAnswer;
		var userGender = $scope.register.userGender;
		var dateOfBirth = $scope.register.dateOfBirth;
		var selectedInterest = $scope.selectedInterest;
		if (selectedInterest == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must select minimum 1 maximum 3 user interest."
			$scope.basicInformation = false;
			$scope.userInterestInformation = true;
			$scope.loginInformation = false;
		}
		if (password == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must enter a password."
			$scope.basicInformation = false;
			$scope.userInterestInformation = false;
			$scope.loginInformation = true;

		} else {
			password = password.trim();
		}
		if (confirmPassword == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must confirm the password."
			$scope.basicInformation = false;
			$scope.userInterestInformation = false;
			$scope.loginInformation = true;

		} else {
			confirmPassword = confirmPassword.trim();
		}
		if (userName == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must confirm the password."
			$scope.basicInformation = false;
			$scope.userInterestInformation = false;
			$scope.loginInformation = true;

		} else {
			userName = userName.trim();
		}
		if (firstName == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must enter a First Name."
			$scope.basicInformation = true;
			$scope.userInterestInformation = false;
			$scope.loginInformation = false;

		} else {
			firstName = firstName.trim();
		}
		if (lastName == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must enter a Last Name."
			$scope.basicInformation = true;
			$scope.userInterestInformation = false;
			$scope.loginInformation = false;

		} else {
			lastName = lastName.trim();
		}
		if (secretQues == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must Select a Secret Question."
			$scope.basicInformation = false;
			$scope.userInterestInformation = false;
			$scope.loginInformation = true;

		} else {
			secretQues = secretQues.trim();
		}
		if (sectAnswer == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must answer the secret question."
			$scope.basicInformation = false;
			$scope.userInterestInformation = false;
			$scope.loginInformation = true;

		} else {
			sectAnswer = sectAnswer.trim();
		}
		if (userGender == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must select a gender."
			$scope.basicInformation = true;
			$scope.userInterestInformation = false;
			$scope.loginInformation = false;

		}
		if (dateOfBirth == undefined) {
			errorPresent = true;
			inputErrorMessage = "You must enter date of Birth."
			$scope.basicInformation = true;
			$scope.userInterestInformation = false;
			$scope.loginInformation = false;

		}

		if (errorPresent) {
			$scope.errorMessage = inputErrorMessage;
			$window.location.relace = '/register';

		} else if (password != confirmPassword) {
			$scope.errorMessage = 'Password and ReEntered Password are not matching. ';
			$window.location.relace = '/register';

		} else {
			$http.post('/registerUser', {
				firstName: firstName,
				lastName: lastName,
				userName: userName,
				password: password,
				secretQues: secretQues,
				sectAnswer: sectAnswer,
				userGender: userGender,
				dateOfBirth: dateOfBirth,
				avaiableUserId: $scope.avaiableUserId

			}).then(function(response) {
				var responseStatus = response.data.status;
				if (responseStatus == 'error') {
					$scope.errorMessage = response.data.errorMsg;
					$window.location.relace = '/register';
				} else {

					$http.post('/registerInterests', {
						avaiableUserId: $scope.avaiableUserId,
						selectedInterest: selectedInterest
					}).then(function(responsePref) {
						var responseStatus = responsePref.data.status;


						if (responseStatus == 'error') {
							$scope.errorMessage = responsePref.data.errorMsg;
							$window.location.relace = '/register';
						} else {


							$window.location.href = '/';

						}



					}).catch(function(errorPref) {
						$scope.errorMessage = error.data.errorMessage;
						$window.location.relace = '/register';


					});

				}


			}).catch(function(error) {
				$scope.errorMessage = error.data.errorMessage;
				$window.location.relace = '/register';


			});
		}


	};


});
prometheusHackathonModuleApp.controller("homePageController", function($scope, $http, $window) {
	$scope.interestNotAdded = true;
	$scope.userSelection = [];
	$scope.userSelectionBak = [];
	$scope.displayTableData = false;
	$scope.selectedRow = null;
	$scope.selectedRowDisplay = true;
	$scope.currentSelectedRow = -1;
	$scope.showCloseButton = false;
	$scope.editInterest = [];
	$scope.editInterestBackup = [];
	$scope.disableEditInterest = true;
	$scope.showEditButton = true;

	$scope.toggleFeaturesSelection = function toggleSelection(userSelection, index, typeEven, $typeOdd, section) {
		var idx = $scope.userSelection.indexOf(userSelection.feature);
		var idxBK = $scope.userSelectionBak.indexOf(userSelection.feature);
		$scope.errorMessage = '';
		var errorUsed = false;
		// Is currently selected
		console.log($scope.userSelectionBak);

		if (idxBK > -1) {
			var elementName = '';
			if (typeEven) {

				if (section == 1) {
					elementName = 'fetauresToSelect_even_first_' + index;
				} else if (section == 2) {
					elementName = 'fetauresToSelect_even_second_' + index;
				}

			} else if (typeOdd) {
				if (section == 1) {
					elementName = 'fetauresToSelect_odd_first_' + index;
				} else if (section == 2) {
					elementName = 'fetauresToSelect_odd_second_' + index;
				}
			}
			document.getElementById(elementName).checked = false;

			$scope.userSelectionBak.splice(idxBK, 1);
			$scope.errorMessage = '';
			errorUsed = true;


		}

		if (idx > -1) {
			$scope.userSelection.splice(idx, 1);
		}

		// Is newly selected
		else {

			if ($scope.userSelection.length >= 3) {
				if (!errorUsed) {
					$scope.errorMessage = 'Maximum 3 selections are allowed.';
					var elementName = '';
					if (typeEven) {

						if (section == 1) {
							elementName = 'fetauresToSelect_even_first_' + index;
						} else if (section == 2) {
							elementName = 'fetauresToSelect_even_second_' + index;
						}

					} else if (typeOdd) {
						if (section == 1) {
							elementName = 'fetauresToSelect_odd_first_' + index;
						} else if (section == 2) {
							elementName = 'fetauresToSelect_odd_second_' + index;
						}
					}


					document.getElementById(elementName).checked = false;
				}

				
				$scope.userSelectionBak.push(userSelection.feature);

			} else {
				$scope.userSelection.push(userSelection.feature);
				$scope.userSelectionBak.push(userSelection.feature);
			}


		}

	};

	$http.post('/populateLoginData', {

	}).then(function(response) {

		var responseStatus = response.data.status;

		if (responseStatus == 'error') {
			$window.location.href = '/';
		} else {
			$scope.userName = response.data.userName;
			$scope.listOfFeatures = response.data.listOfFeatures;
			$scope.listOfFeaturesFirstSet = [];
			$scope.listOfFeaturesSecondSet = [];
			for (var i = 0; i < $scope.listOfFeatures.length; i++) {
				if (i % 2 == 0) {
					$scope.listOfFeaturesFirstSet.push($scope.listOfFeatures[i]);
				} else {
					$scope.listOfFeaturesSecondSet.push($scope.listOfFeatures[i]);
				}
			}
			$scope.listOfInterests = response.data.listOfInterests;
			$scope.listOfInterestsNames = [];

			for (var j = 0; j < $scope.listOfInterests.length; j++) {
				$scope.listOfInterestsNames.push($scope.listOfInterests[j].interest);
			}

			$http.post('/getUserInterestList', {

			}).then(function(response) {

				if (response.data.status == 'success') {
					var currentListOfInterest = response.data.interests;
					var currentListOfInterestArray = [];
					for (var i = 0; i < currentListOfInterest.length; i++) {
						var loopJsonObject = '';

						if ($scope.listOfInterestsNames.includes(currentListOfInterest[i].interest)) {
							loopJsonObject = { 'interest': currentListOfInterest[i].interest, 'prefimg': currentListOfInterest[i].prefimg, 'select': true };
							
							$scope.editInterest.push(currentListOfInterest[i].interest);
							$scope.editInterestBackup.push(currentListOfInterest[i].interest);
						} else {
							loopJsonObject = { 'interest': currentListOfInterest[i].interest, 'prefimg': currentListOfInterest[i].prefimg, 'select': false };
						}
						currentListOfInterestArray.push(loopJsonObject);
					}


					$scope.editInterests = currentListOfInterestArray;
					

				}

			});
			$window.location.relace = '/loginPage';
		}




	});

	$scope.doRecomondationSearch = function doRecomondationSearch() {

		if ($scope.interestNotAdded) {
			for (var i = 0; i < $scope.listOfInterests.length; i++) {
				var interest = $scope.listOfInterests[i].interest;
				$scope.userSelection.push(interest);
			}
			$scope.interestNotAdded = false;


		}

		var userSelectionList = '';
		for (var j = 0; j < $scope.userSelection.length; j++) {
			var currentSelection = $scope.userSelection[j];
			if (userSelectionList == '') {
				userSelectionList = '"' + currentSelection + '"';
			} else {
				userSelectionList = userSelectionList + ',"' + currentSelection + '"';
			}
		}
		userSelectionList = "[" + userSelectionList + "]";
		var recomondationInputList = '{"featureInterestList":' + userSelectionList + '}';

		$http.post('/getRecomondation', {
			recomondationList: JSON.parse(recomondationInputList),

		}).then(function(response) {

			var responseStatus = response.data.status;

			if (responseStatus == 'error') {
				$scope.errorMessage = response.data.errorMsg;


			} else {
				var listOfRecomondation = response.data.listOfRecomondation;
				$scope.listOfRecomondation = listOfRecomondation;
				$scope.displayTableData = true;


			}



		});



	};

	$scope.showHideRow = function showHideRow(rowIndex) {
		if ($scope.currentSelectedRow != rowIndex) {
			$scope.selectedRow = rowIndex;
			$scope.selectedRowDisplay = false;
			$scope.currentSelectedRow = rowIndex;

		} else {
			if ($scope.selectedRowDisplay) {
				$scope.selectedRow = rowIndex;
				$scope.selectedRowDisplay = false;
				$scope.currentSelectedRow = rowIndex;
			} else {
				$scope.selectedRow = -1;
				$scope.selectedRowDisplay = true;
				$scope.currentSelectedRow = -1;
			}
		}



	};
	$scope.logoutUser = function() {
		$http.post('/logoutUser', {}).then(function(response) {
			var dataRetruned = response.data;
			if (dataRetruned.status = 'success') {
				$window.location.href = '/';
			} else {
				$window.location.replace = '/';
			}


		}).catch(function(error) {
			$window.location.replace = '/';


		});
	};
	$scope.openGraph = function openGraph(graphType, locationId) {
		var graphInput = undefined;

		if (graphType == 'rowGraph') {

			var userSelectionList = '';
			if (locationId != undefined) {
				userSelectionList = '"' + locationId + '"';
			}
			for (var j = 0; j < $scope.userSelection.length; j++) {
				var currentSelection = $scope.userSelection[j];
				if (userSelectionList == '') {
					userSelectionList = '"' + currentSelection + '"';
				} else {
					userSelectionList = userSelectionList + ',"' + currentSelection + '"';
				}
			}
			userSelectionList = "[" + userSelectionList + "]";
			graphInput = '{"featureInterestLocationList":' + userSelectionList + '}';
			//	graphInput=JSON.parse(graphInput);


		} else if (graphType == 'fullGraph') {
			graphInput = '';
		}
		$http.post('/openGraph', {
			graphInput: graphInput,
			graphType: graphType

		}).then(function(response) {

			var responseStatus = response.data.status;


			if (responseStatus == 'error') {
				$scope.errorMessage = response.data.errorMsg;


			} else {
				if (response.data.graphData.nodeList != undefined) {
					var data = {
						nodes: response.data.graphData.nodeList,
						edges: response.data.graphData.edgeList,
					};
					var options = {
						nodes: {
							shape: "dot",
							size: 20,
							font: {
								size: 12,
								color: "#ffffff",
							},
							borderWidth: 2,
						},
						edges: {
							width: 2,
						},
					};
					var container = document.getElementById("openPopup");
					network = new vis.Network(container, data, options);
					var popUp = document.querySelector(".full-screen");
					popUp.classList.toggle('hidden-pop');
					$scope.showCloseButton = true;

				} else {

					$scope.errorMessage = 'There is some technical issue. Please try after some time.';
				}


			}



		});




	};

	$scope.closeGraph = function closeGraph() {
		var popUp = document.querySelector(".full-screen");
		popUp.classList.toggle('hidden-pop');
		$scope.showCloseButton = false;

	};
	$scope.toggleEditSelection = function toggleSelection(selectedInterest, index) {
		var idx = $scope.editInterest.indexOf(selectedInterest.interest);
		var idxBK = $scope.editInterestBackup.indexOf(selectedInterest.interest);
		var errorUsed = false;
		if (idxBK > -1) {

			$scope.editInterestBackup.splice(idxBK, 1);
			var elementName = 'edit_interest_' + index;
			document.getElementById(elementName).checked = false;
			$scope.errorMessage = '';
			errorUsed = true;


		}


		if (idx > -1) {
			$scope.editInterest.splice(idx, 1);



		} else {

			if ($scope.editInterest.length >= 3) {
				if (!errorUsed) {
					$scope.errorMessage = "Maximum 3 seletions are allowed.";
					var elementName = 'edit_interest_' + index;
					document.getElementById(elementName).checked = false;

				}

				$scope.editInterestBackup.push(selectedInterest.interest);
			} else {

				$scope.editInterest.push(selectedInterest.interest);
				$scope.editInterestBackup.push(selectedInterest.interest);

			}



		}

	};
	$scope.editUserInterest = function editUserInterest() {
		
		$http.post('/updateUserInterest', {}).then(function(response) {
			var dataRetruned = response.data;
			if (dataRetruned.status = 'success') {

				$http.post('/registerInterests', {
					selectedInterest: $scope.editInterest
				}).then(function(responsePref) {
					var responseStatus = responsePref.data.status;


					if (responseStatus == 'error') {
						$scope.errorMessage = responsePref.data.errorMsg;
						$window.location.replace = '/loginPage';

					} else {
						$scope.infoMessage = "User Interest is successfully updated";
						$window.location.href = '/loginPage';

					}



				}).catch(function(errorPref) {
					$scope.errorMessage = 'There is some Technical issues. Please try after some time.';
					$window.location.replace = '/loginPage';



				});

			} else {
				$scope.errorMessage = dataRetruned.errorMsg;
				$window.location.replace = '/loginPage';
			}


		}).catch(function(error) {

			$scope.errorMessage = "There is some technical issue. Please try after some time.";
			$window.location.replace = '/loginPage';
		});

		$scope.showEditButton = true;
		$scope.disableEditInterest = true;
	};
	$scope.enableInterestEdit = function editInterest() {
		$scope.showEditButton = false;
		$scope.disableEditInterest = false;
	};
	$scope.saveLocation = function saveLocation(locationId) {
		$http.post('/updateUserTravel', {
			locationId: locationId
		}).then(function(responsePref) {
			var responseStatus = responsePref.data.status;
			

			if (responseStatus == 'error') {
				$scope.errorMessage = responsePref.data.errorMsg;
				$window.location.replace = '/loginPage';

			} else {

				$scope.infoMessage = responsePref.data.message
				$window.location.replace = '/loginPage';

			}



		}).catch(function(errorPref) {
			$scope.errorMessage = 'There is some Technical issues. Please try after some time.';
			$window.location.replace = '/loginPage';
			



		});



		window.open('https://www.makemytrip.com/');
	};
});

