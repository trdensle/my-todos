angular.module('MyTodos').service('TodoService', function($q, $http) {
	this.getTodos = function() {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/todos'
		}).then(function(response) {
			deferred.resolve(response.data);
		});
		return deferred.promise;
	};
	this.save = function(todo) {
		var deferred = $q.defer();
		$http({
			method: 'PUT',
			url: '/api/todos/'+todo._id,
			data: todo
		}).then(function(response) {
			deferred.resolve(response.data);
		});
		return deferred.promise;
	};
	this.add = function(todo) {
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: '/api/todos',
			data: todo
		}).then(function(response) {
			deferred.resolve(response.data);
		});
		return deferred.promise;
	};
});






















// angular.module('MyTodos').service('TodoService', function($q, $http) {
// 	this.getTodos = function() {
// 		var deferred = $q.defer();
// 		deferred.resolve([
// 			{
// 				title: 'Grab eggs',
// 				completed: false
// 			},
// 			{
// 				title: 'Visit mom',
// 				completed: false
// 			},
// 			{
// 				title: 'Pay bills',
// 				completed: true
// 			}
// 		]);
// 		return deferred.promise;
// 	};
// 	this.save = function(todo) {
// 		var deferred = $q.defer();
// 		deferred.resolve(true);
// 		return deferred.promise;
// 	};
// });