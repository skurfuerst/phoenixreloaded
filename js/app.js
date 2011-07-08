var ContentModule;
ContentModule = SC.Application.create({
	_bootstrap: function() {
		$('body').append($('<div class="typo3-rightarea aloha-block-do-not-deactivate" id="t3-ui-rightarea" />')); // TODO: change prefix to "t3"
		$('body').append($('<div class="typo3-actionmenu aloha-block-do-not-deactivate" id="t3-ui-actionmenu" />'));
		$('body').append($('<div class="typo3-breadcrumbmenu aloha-block-do-not-deactivate" id="t3-ui-breadcrumbmenu" />'));
		$('body').addClass('typo3-backend');

		var breadcrumbMenuView = SC.View.create({
			template: SC.Handlebars.compile('{{#collection contentBinding="ContentModule.BlockSelectionController"}} {{content.title}} {{/collection}}!')
		});
		breadcrumbMenuView.appendTo($('.typo3-breadcrumbmenu'));
	},
	_onBlockSelectionChange: function(selectedBlocks) {
		ContentModule.BlockSelectionController.updateSelectedBlocks(selectedBlocks);
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