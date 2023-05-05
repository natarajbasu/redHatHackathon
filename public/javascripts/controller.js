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
		'sessionKey': 'unAuthAccess'

	}).then(function(response) {
		var dataRetruned = response.data;

		if (dataRetruned.type.trim() == 'Error') {

			$scope.errorMessage = dataRetruned.message;

		}

	});

	$http.post('/getSessionMessage', {
		'sessionKey': 'firstPage'

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
			console.log(response);
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
	$scope.selectedInterest = [];
	$scope.toggleSelection = function toggleSelection(selectedInterest) {
		var idx = $scope.selectedInterest.indexOf(selectedInterest);

		// Is currently selected
		if (idx > -1) {
			$scope.selectedInterest.splice(idx, 1);
		}

		// Is newly selected
		else {
			$scope.selectedInterest.push(selectedInterest.interest);
		}
		console.log($scope.selectedInterest);
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
		var password = $scope.register.password.trim();
		var confirmPassword = $scope.register.confirmPassword.trim();
		if (password != confirmPassword) {
			$scope.errorMessage = 'Password and ReEntered Password are not matching. ';
			$window.location.relace = '/register';

		} else {
			$http.post('/registerUser', {
				firstName: $scope.register.firstName,
				lastName: $scope.register.lastName,
				userName: $scope.register.userName,
				password: $scope.register.password,
				secretQues: $scope.register.secretQues,
				sectAnswer: $scope.register.sectAnswer,
				userGender: $scope.register.userGender,
				dateOfBirth: $scope.register.dateOfBirth,
				avaiableUserId: $scope.avaiableUserId

			}).then(function(response) {
				var responseStatus = response.data.status;
				if (responseStatus == 'error') {
					$scope.errorMessage = response.data.errorMsg;
					$window.location.relace = '/register';
				} else {
					console.log($scope.register);
					console.log($scope.selectedInterest);
					$http.post('/registerInterests', {
						avaiableUserId: $scope.avaiableUserId,
						selectedInterest: $scope.selectedInterest
					}).then(function(responsePref) {
						var responseStatus= responsePref.data.status;
					
						
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

});

