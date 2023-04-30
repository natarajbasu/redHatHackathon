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



});

prometheusHackathonModuleApp.controller("homePageController", function($scope, $http, $window) {

});
prometheusHackathonModuleApp.controller("registrationPageController", function($scope, $http, $window) {


});
prometheusHackathonModuleApp.controller("forgetPasswordPageController", function($scope, $http, $window) {


});