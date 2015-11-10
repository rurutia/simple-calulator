(function() {
	var module = angular.module("app");
	module.factory("Calculator", function($rootScope) {
		var calculator = function() {
			this.calculate = _calculate;
			this.addResult = _addResult;
			this.getCurrentResult = _getCurrentResult;
			this.appendExpression = _appendExpression;
			this.deleteAllResults = _deleteAllResults;
			this.getResults = _getResults;
			this.setResults = _setResults;

			var _results = [],
				_currentResult = {
					expression: '',
					result: undefined,
					date: undefined
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
					_currentResult = {
						expression: '',
						result: undefined
					};
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
	})
})();