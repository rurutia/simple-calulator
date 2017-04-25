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
	.value('AppNameValue', 'Simple Calculator')
	.service('appNameService', function(AppNameValue) {
		this.name = AppNameValue + 'from service';
	})
	.factory('appNameFactory', function(AppNameValue) {
		//var service = function() {
		//	this.name = AppNameValue + 'from service';
		//};


		//return service;
		//
		//return new sevice();


		return {
			name: AppNameValue + 'from factory'
		};
	})
	.controller("headerCtrl", function(appNameService, appNameFactory) {
		var vm = this;

		vm.appName = appNameFactory.name;
	})
	.controller("mainCtrl", function($scope, $document, Calculator, historyService) {
		var vm = this;
		
		vm.calculator = new Calculator();

		$document.keydown(function(e) {
			if(e.keyCode === 8) {
				vm.calculator.deleteLastChar();
				$scope.$apply();
				e.preventDefault();
			}
		});

		$document.keypress(function(e) {
			if(e.keyCode === 13) {
				vm.calculator.calculate();
			}
			else {
				var charCode = String.fromCharCode(e.keyCode);
				vm.calculator.appendExpression(charCode);
			}
			$scope.$apply();
		});

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
	.directive("inputBtn", function() {
		return {
			restriction: "E",
			template: '<button ng-click="selectInput()" type="button" class="btn btn-default btn-block">{{input}}</button>',
			scope: {
				input: '@',
				calculator: '='
			},
			link: function(scope, elem, attrs) {
				scope.selectInput = function() {
					scope.calculator.appendExpression(scope.input);
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