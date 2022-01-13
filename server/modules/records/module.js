(function () {
	'use strict';

	module.exports = init;

	function init () {
		return {
			controller: require('./controller'),
			middleware: require('./middleware'),
            model: require('./model'),
            service: require('./service')
		};
	}
})();
