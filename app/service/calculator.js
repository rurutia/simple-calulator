(function() {
	var module = angular.module("app"),
	injectParams = ["$rootScope"];

	var Calculator = function($rootScope) {
		var calculator = function() {
			this.calculate = _calculate;
			this.addResult = _addResult;
			this.getCurrentResult = _getCurrentResult;
			this.appendExpression = _appendExpression;
			this.deleteLastChar = _deleteLastChar;
			this.deleteAllResults = _deleteAllResults;
			this.getResults = _getResults;
			this.setResults = _setResults;
			this.resetCurrentResult = _resetCurrentResult;

			var _results = [],
				_currentResult = {
					expression: ''
				};


			function _deleteLastChar() {
				_currentResult.expression = _currentResult.expression.substr(0, _currentResult.expression.length - 1);
			}

			function _resetCurrentResult() {
				_currentResult = {
					expression: '',
				};
			};

			function _calculate() {
				_currentResult.expression = _currentResult.expression.replace(/×/g, '*');
				_currentResult.expression = _currentResult.expression.replace(/÷/g, '/');
				_currentResult.result = $rootScope.$eval(_currentResult.expression);
				_currentResult.date = new Date();
			};

			function _getCurrentResult() {
				return _currentResult;
			};

			function _appendExpression(expression) {
				if(_currentResult.result) {
					_resetCurrentResult();
				}
				_currentResult.expression += expression;
			};

			function _addResult(result) {
				return _results.unshift(result);
			};

			function _getResults() {
				return _results;
			};

			function _setResults(results) {
				_results = results;
			};

			function _deleteAllResults() {
				_results = [];
			};
		};

		return calculator;
	};

	Calculator.$inject = injectParams;
	module.factory("Calculator", Calculator);
})();