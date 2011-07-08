var ContentModule;
ContentModule = SC.Application.create({
	_bootstrap: function() {
		this._initializePropertyPanel();
		this._initializeToolbar();
		this._initializeFooter();

		$('body').addClass('typo3-backend');
	},

	_initializePropertyPanel: function() {
		$('body').append($('<div class="typo3-rightarea aloha-block-do-not-deactivate" id="t3-ui-rightarea" />')); // TODO: change prefix to "t3"; change style names to "Property Panel"

		var propertyPanelView = SC.View.create({
			template: SC.Handlebars.compile('{{#collection contentBinding="ContentModule.CurrentlyActivatedBlockSchema"}}\
{{view ContentModule.PropertyPanelSection}}\
 {{/collection}}!')
		});
		propertyPanelView.appendTo($('.typo3-rightarea'));
	},
	_initializeToolbar: function() {
		$('body').append($('<div class="typo3-actionmenu aloha-block-do-not-deactivate" id="t3-ui-actionmenu" />')); // TODO. rename CSS to toolbar
	},
	_initializeFooter: function() {
		$('body').append($('<div class="typo3-breadcrumbmenu aloha-block-do-not-deactivate" id="t3-ui-breadcrumbmenu" />')); // TODO: rename CSS

		var breadcrumbMenuView = SC.View.create({
			template: SC.Handlebars.compile('{{#collection contentBinding="ContentModule.BlockSelectionController"}} {{content.title}} {{/collection}}!')
		});
		breadcrumbMenuView.appendTo($('.typo3-breadcrumbmenu'));
	},

	_onBlockSelectionChange: function(selectedBlocks) {
		ContentModule.BlockSelectionController.updateSelectedBlocks(selectedBlocks);
	}
});

ContentModule.PropertyPanelSection = SC.View.extend({
	template: SC.Handlebars.compile('<div class="t3-propertypanel-section">\
<h2>{{parentView.content.key}} {{parentView.content.properties}}</h2>\\n\
\
{{#each content.properties}}\
Foo\
{{/each}}\
</div>')
});

ContentModule.CurrentlyActivatedBlockSchema = SC.ArrayProxy.create({
	content: [],

	setCurrentSchema: function(schema) {
		if (schema === null || schema === undefined) {
			schema = [];
		}
		this.content.set('[]', schema);
	}
});


ContentModule.BlockSelectionController = SC.ArrayProxy.create({
	content: [],

	updateSelectedBlocks: function(selectedBlocks) {
		this.content.set('[]', selectedBlocks);
		if (selectedBlocks.length > 0) {
			ContentModule.CurrentlyActivatedBlockSchema.setCurrentSchema(selectedBlocks[0].getSchema());
		} else {
			ContentModule.CurrentlyActivatedBlockSchema.setCurrentSchema(null);
		}
	}
});

SC.$(document).ready(function() {


	ContentModule._bootstrap();
});


Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});