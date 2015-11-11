(function() {
	var module = angular.module("app");

	var injectParams = [];
	var inputBtn = function() {
		return {
			restriction: "E",
			template: '<button ng-click="selectInput()" type="button" class="btn btn-default btn-block">{{input}}</button>',
			scope: {
				input: '@',
				calculator: '='
			},
			link: function(scope, elem, attrs) {
				scope.selectInput = function(event) {
					scope.calculator.appendExpression(scope.input);
				};
			}
		};
	};
	inputBtn.$inject = injectParams;
	module.factory("inputBtn", inputBtn);
});