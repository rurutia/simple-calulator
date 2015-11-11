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

	.controller("mainCtrl", function($scope, Calculator, historyService) {
		var vm = this;

		vm.calculator = new Calculator();

		vm.deleteAll = function() {
			historyService.deleteAll().then(function(data) {
				if(data.success) {
					vm.calculator.deleteAllResults();
				}
			});	
		};

		historyService.getAll().then(function(history) {
			if(Object.prototype.toString.call(history) === "[object Array]") {
				history.sort(function(h1, h2) {
					return (new Date(h2.date)).getTime() - (new Date(h1.date)).getTime();
				});
				vm.calculator.setResults(history);
			}
		});

		$scope.$watch(function() {
			return vm.calculator.getCurrentResult();
		}, function(current) {
			if(typeof current.result !== 'undefined') {
				vm.display = current.result;
				vm.calculator.addResult(current);
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
			template: '<button ng-click="selectNumber()" type="button" class="btn btn-default btn-block">{{number}}</button>',
			scope: {
				number: '@',
				calculator: '='
			},
			link: function(scope, elem, attrs) {
				scope.selectNumber = function() {
					scope.calculator.appendExpression(scope.number);
				};
			}
		};
	})
	.directive("decimalBtn", function() {
		return {
			restriction: "E",
			template: '<button ng-click="selectDecimal()" type="button" class="btn btn-default btn-block">.</button>',
			scope: {
				calculator: '='
			},
			link: function(scope, elem, attrs) {
				scope.selectDecimal = function() {
					scope.calculator.appendExpression(".");
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
				scope.btnClass.push('btn-block');

				switch(scope.operator) {
					case "=":
						scope.btnClass.push('btn-primary');
						scope.doOperation = function() {
							scope.calculator.calculate();
						};
						break;

					case "AC":
						scope.btnClass.push('btn-primary');
						scope.doOperation = function() {
							scope.calculator.resetCurrentResult();
						};
						break;

					default:
						scope.btnClass.push('btn-success');
						scope.doOperation = function() {
							scope.calculator.appendExpression(scope.operator);
						}
						break;
				}
			}
		};
	})
	;
})();