var ContentModule;
ContentModule = SC.Application.create({
	_bootstrap: function() {
		$('body').append($('<div class="typo3-rightarea" />'));
		$('body').append($('<div class="typo3-actionmenu" />'));
		//$('body').append($('<div class="typo3-breadcrumbmenu" />'));
		$('body').addClass('typo3-backend');

		/*var breadcrumbMenuView = SC.View.create({
			template: Handlebars.compile('{{content}} {{#collection binding="people.content"}} {{/collection}}!'),
			content: 'Foo',
			people: ContentModule.peopleController
		});
		breadcrumbMenuView.appendTo($('.typo3-breadcrumbmenu'));*/
	},
	_onBlockSelectionChange: function(selectedBlocks) {
		ContentModule.BlockSelectionController.updateSelectedBlocks(selectedBlocks);
	}
});
ContentModule.peopleController = SC.ArrayProxy.create({
	content: ['Steph', 'Tom', 'Ryan', 'Chris', 'Jill']
});


ContentModule.BlockSelectionController = SC.ArrayProxy.create({
	// Initialize the array controller with an empty array.
	content: [],

	updateSelectedBlocks: function(selectedBlocks) {
			// Remove array
		this.content.set('[]', selectedBlocks);
	}
});

ContentModule._bootstrap();