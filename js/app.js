var ContentModule;
ContentModule = SC.Application.create({
	_bootstrap: function() {
		this._initializePropertyPanel();
		this._initializeToolbar();
		this._initializeFooter();

		$('body').addClass('t3-backend');
	},

	_initializePropertyPanel: function() {
	return;
		$('body').append($('<div class="t3-rightarea aloha-block-do-not-deactivate" id="t3-ui-rightarea"></div>'));

		var propertyPanelView = SC.View.create({ //
			template: SC.Handlebars.compile('A{{#each schema}}\
XX{{key}}{{label}} {{thestuff}}\
x{{#each thestuff}} ASDF {{/each}}y\
{{/each}}'),
			schema: [
				{
					key: 'Plugin Settings',
					label: 'huhu',
					thestuff: [
						{
							key: 'package',
							type: 'string',
							label: 'Package'
						}, {
							key: 'controller',
							type: 'string',
							label: 'Controller'
						}
					]
				},
				{
					key: 'Access',
					thestuff: [
						{
							key: 'visibility',
							type: 'boolean',
							label: 'Visibility'
						}
					]
				},
			]
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
			elementId: 't3-toolbar',
			left: [
				ContentModule.ToggleButton.extend({
					label: 'Pages'
				}),
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
		var breadcrumb = ContentModule.Breadcrumb.extend({
			contentBinding: 'ContentModule.BlockSelectionController'
		});
		var footer = ContentModule.Toolbar.create({
			elementId: 't3-footer',
			left: [
				breadcrumb
			]
		});
		footer.appendTo($('body'));
	},

	_onBlockSelectionChange: function(selectedBlocks) {
		ContentModule.BlockSelectionController.updateSelectedBlocks(selectedBlocks);
	}

});

ContentModule.Breadcrumb = SC.View.extend({
	tagName: 'ul',
	classNames: ['t3-breadcrumb', 'aloha-block-do-not-deactivate'],
	template: SC.Handlebars.compile('{{#collection contentBinding="parentView.content" tagName="li"}}{{content.title}}{{/collection}}')
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