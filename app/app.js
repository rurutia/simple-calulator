(function() {
	angular.module("app", [])
	.controller("mainCtrl", function($scope) {
		var vm = this;

		vm.calculator = {
			isDone: false,
			current: {
				expression: '',
				result: undefined
			},
			results: []
		};



		$scope.$watch(function() {
			return vm.calculator.current;
		}, function(current) {
			console.log(current);
			if(current.result) {
				vm.display = current.result;
				vm.calculator.results.push(current);
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