var ContentModule;
ContentModule = SC.Application.create({
	_bootstrap: function() {
		this._initializePropertyPanel();
		this._initializeToolbar();
		this._initializeFooter();

		$('body').addClass('t3-backend');
	},

	_initializePropertyPanel: function() {
		$('body').append($('<div class="t3-rightarea aloha-block-do-not-deactivate" id="t3-ui-rightarea"></div>'));

		var propertyPanelView = SC.View.create({
			template: SC.Handlebars.compile('<form class="t3-propertypanel-form" action="#"> {{#collection tagName="fieldset" classNames="t3-propertypanel-section" contentBinding="ContentModule.CurrentlyActivatedBlockSchema.schema"}}<h2>{{content.key}}</h2> {{#each content.properties}}<div class="t3-propertypanel-field"> {{key}} </div>{{/each}} {{/collection}} </form>')
		});

		/*var propertyPanelView = SC.View.create({
			template: SC.Handlebars.compile('{{#collection contentBinding="ContentModule.CurrentlyActivatedBlockSchema"}}\
{{view ContentModule.PropertyPanelSection}}\
 {{/collection}}!')
		});*/
		propertyPanelView.appendTo($('.t3-rightarea'));
	},

	_initializeToolbar: function() {
		var toolbar = ContentModule.Toolbar.create({
			left: [
				ContentModule.ToggleButton.extend({
					target: 'ContentModule.PreviewController',
					action: 'togglePreview',
					label: 'Preview',
					icon: 'preview'
				})
			],
			right: [
				ContentModule.Button.extend({
					label: 'Save',
					disabledBinding: 'ContentModule.ChangesController.noChanges'
				}),
				ContentModule.Button.extend({
					label: 'Revert'
				})
			]
		});
		toolbar.appendTo($('body'));

	},

	_initializeFooter: function() {
		$('body').append($('<div class="t3-breadcrumbmenu aloha-block-do-not-deactivate" id="t3-ui-breadcrumbmenu" />')); // TODO: rename CSS

		var breadcrumbMenuView = SC.View.create({
			template: SC.Handlebars.compile('{{#collection contentBinding="ContentModule.BlockSelectionController"}} {{content.title}} {{/collection}}!')
		});
		breadcrumbMenuView.appendTo($('.t3-breadcrumbmenu'));
	},

	_onBlockSelectionChange: function(selectedBlocks) {
		ContentModule.BlockSelectionController.updateSelectedBlocks(selectedBlocks);
	}

});

ContentModule.Toolbar = SC.View.extend({
	tagName: 'div',
	classNames: ['t3-toolbar', 'aloha-block-do-not-deactivate'],
	left: [],
	right: [],
	template: SC.Handlebars.compile('{{#collection contentBinding="parentView.left" tagName="ul" classNames="t3-toolbar-left"}}{{view content}}{{/collection}}{{#collection contentBinding="parentView.right" tagName="ul" classNames="t3-toolbar-right"}}{{view content}}{{/collection}}')
});

ContentModule.Button = SC.Button.extend({
	classNames: ['t3-button'],
	attributeBindings: ['disabled'],
	classNameBindings: ['iconClass'],
	label: '',
	disabled: false,
	icon: '',
	template: SC.Handlebars.compile('{{label}}'),
	iconClass: function() {
		var icon = this.get('icon');
		return icon !== '' ? 't3-icon-' + icon : '';
	}.property('icon')
});

ContentModule.ToggleButton = ContentModule.Button.extend({
	classNames: ['t3-button'],
	classNameBindings: ['pressed'],
	pressed: false,
	toggle: function() {
		this.set('pressed', !this.get('pressed'));
	},
	mouseUp: function(event) {
		if (this.get('isActive')) {
			var action = this.get('action'),
			target = this.get('targetObject');

			this.toggle();
			if (target && action) {
				if (typeof action === 'string') {
					action = target[action];
				}
				action.call(target, this.get('pressed'), this);
			}

			this.set('isActive', false);
		}

		this._mouseDown = false;
		this._mouseEntered = false;
	}
});

ContentModule.PreviewController = SC.Object.create({
	previewMode: false,

	togglePreview: function(pressed) {
		this.set('previewMode', pressed);
	}
});


ContentModule.ChangesController = SC.ArrayProxy.create({
	content: [],

	addChange: function(change) {
		this.pushObject(change);
	},

	noChanges: function() {
		return this.get('length') == 0;
	}.property('length')
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

ContentModule.CurrentlyActivatedBlockSchema = SC.Object.create({
	schema: [],

	setCurrentSchema: function(schema) {
		if (schema === null || schema === undefined) {
			schema = [];
		}
		this.set('schema', schema);
	}
});


ContentModule.BlockSelectionController = SC.ArrayProxy.create({
	content: [],

	updateSelectedBlocks: function(selectedBlocks) {
		this.set('[]', selectedBlocks);
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