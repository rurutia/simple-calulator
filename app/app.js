(function() {
	angular.module("app", [])
	.factory('historyService', function($http) {
		return {
			getAll: _getAll,
			save: _save,
			deleteAll: _deleteAll
		};

		function _getAll() {
			return $http({method: "get", url: "/result"})
			.then(function(response) {
				return response.data;
			});
		}; 

		function _deleteAll() {
			return $http({method: "delete", url: "/result"})
			.then(function(response) {
				return response.data;
			});
		}; 

		function _save(result) {
			console.log("saving result...");
			console.log(result);
			return $http({method: "post", url: "/result", data: result})
			.then(function(response) {
				return response.data;
			});
		}; 
	})
	.controller("mainCtrl", function($scope, historyService) {
		var vm = this;

		vm.calculator = {
			isDone: false,
			current: {
				expression: '',
				result: undefined,
				date: undefined
			},
			results: []
		};

		vm.deleteAll = function() {
			historyService.deleteAll().then(function(data) {
				console.log(data);
				if(data.success) {
					historyService.getAll().then(function(history) {
						vm.calculator.results = history;
					});
				}
			});	
		};

		historyService.getAll().then(function(history) {
			vm.calculator.results = history;
			vm.calculator.results.sort(function(h1, h2) {
				return (new Date(h2.date)).getTime() - (new Date(h1.date)).getTime();
			});
		});

		$scope.$watch(function() {
			return vm.calculator.current;
		}, function(current) {
			console.log(current);
			if(current.result) {
				vm.display = current.result;
				vm.calculator.results.unshift(current);
				historyService.save(current);
			} 
			else {
				vm.display = current.expression;
			}	
		}, true);
		
	})
	.directive("numBtn", function() {
		return {
			restriction: "E",
			template: '<button ng-click="selectNumber()" type="button" class="btn btn-default">{{number}}</button>',
			scope: {
				number: '@',
				calculator: '='
			},
			link: function(scope, elem, attrs) {
				scope.selectNumber = function() {
					if(scope.calculator.current.result) {
						scope.calculator.current = {
							expression: '',
							result: undefined
						};
					}
					scope.calculator.current.expression += scope.number;
				};
			}
		};
	})
	.directive("decimalBtn", function() {
		return {
			restriction: "E",
			template: '<button ng-click="selectDecimal()" type="button" class="btn btn-default">.</button>',
			scope: {
				calculator: '='
			},
			link: function(scope, elem, attrs) {
				scope.selectDecimal = function() {
					scope.calculator.current.expression += ".";
				};
			}
		};
	})
	.directive("operatorBtn", function($rootScope) {
		return {
			restriction: "E",
			template: '<button ng-click="doOperation()" type="button" ng-class="btnClass">{{operator}}</button>',
			scope: {
				operator: '@',
				calculator: '='
			},
			link: function(scope, elem, attrs) {
				scope.btnClass = [];
				scope.btnClass.push('btn');

				switch(scope.operator) {
					case "=":
						scope.btnClass.push('btn-primary');
						scope.doOperation = function() {
							scope.calculator.current.expression = scope.calculator.current.expression.replace(/×/g, '*');
							scope.calculator.current.expression = scope.calculator.current.expression.replace(/÷/g, '/');
							scope.calculator.current.result = $rootScope.$eval(scope.calculator.current.expression);
							scope.calculator.current.date = new Date();
						};
						break;

					default:
						scope.btnClass.push('btn-success');
						scope.doOperation = function() {
							scope.calculator.current.expression += scope.operator;
						}
						break;
				}
			}
		};
	})
	.factory('resultService', function() {
		var service = function() {
			this.isDone = false;
			this.results = [];
		}
		return service;
	})
	;
})();