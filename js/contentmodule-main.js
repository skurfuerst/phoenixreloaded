define(function() {
	require({baseUrl: 'js/libs/aloha/src'}, ['aloha'], function() {
	});
	require({baseUrl: 'js'}, 'app', function() {
		console.log("app loaded");
	});
});
