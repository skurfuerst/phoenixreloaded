require(
['aloha'],
function() {
	var ContentModule = SC.Application.create({
		_bootstrap: function() {
			$('body').append($('<div class="typo3-rightarea" />'));
			$('body').append($('<div class="typo3-actionmenu" />'));
			$('body').append($('<div class="typo3-breadcrumbmenu" />'));
			$('body').addClass('typo3-backend');
		}
	});

	ContentModule.MyView = SC.View.extend({
	  mouseDown: function() {
		window.alert("hello world!");
	  }
	});

	ContentModule._bootstrap();
});