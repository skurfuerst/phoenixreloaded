var ContentModule;
ContentModule = SC.Application.create({
	_bootstrap: function() {
		$('body').append($('<div class="typo3-rightarea" />'));
		$('body').append($('<div class="typo3-actionmenu" />'));
		$('body').append($('<div class="typo3-breadcrumbmenu" />'));
		$('body').addClass('typo3-backend');

		var breadcrumbMenuView = SC.View.create({
			template: SC.Handlebars.compile('{{#collection contentBinding="ContentModule.BlockSelectionController"}} {{content.id}} {{/collection}}!'),
		});
		breadcrumbMenuView.appendTo($('.typo3-breadcrumbmenu'));
		//$('.typo3-breadcrumbmenu').append(breadcrumbMenuView.$());
	},
	_onBlockSelectionChange: function(selectedBlocks) {	ContentModule.BlockSelectionController.updateSelectedBlocks(selectedBlocks);
	}
});


ContentModule.BlockSelectionController = SC.ArrayProxy.create({
	// Initialize the array controller with an empty array.
	content: [],

	updateSelectedBlocks: function(selectedBlocks) {
		this.content.set('[]', selectedBlocks);
	}
});

SC.$(document).ready(function() {
	ContentModule._bootstrap();
});