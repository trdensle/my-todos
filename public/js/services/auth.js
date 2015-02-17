angular.module('MyTodos').service('AuthService', function($q, $http) {
	this.register = function(email, password) {    //in order to register, you need an email and password
		var deferred = $q.defer();    //when passing in a callback, the function is asyncronous
		$http({
			method: 'POST',
			url: '/api/register',
			data: {
				email: email,
				password: password
			}
		}).then(function(response) {
			deferred.resolve(response.data);
		});
		return deferred.promise;
	};

	this.login = function(email, password) {  //the arguments passed in to test against()
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: '/api/auth',
			data: {    //this tests the data we are comparing against when a user logs in
				email: email,
				password: password
			}
		}).then(function(response) {
			deferred.resolve(response.data);
		}).catch(function(err) {
			console.log("error logging in");
			deferred.reject(err);
		});
		return deferred.promise;
	};
});