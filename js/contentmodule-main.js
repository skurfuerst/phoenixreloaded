define(
	'contentmodule-main',
	function() {
		console.log("LOADED");
		require({baseUrl: 'js/libs/aloha/src'}, ['aloha'], function() {
		});
	}
);
