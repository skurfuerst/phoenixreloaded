var ContentModule;
ContentModule = SC.Application.create({
	_bootstrap: function() {
		SC.TEMPLATES['ContentModule.templatePropertyString'] = SC.Handlebars.compile('<input type="text" />');
		SC.TEMPLATES['ContentModule.templateTest'] = SC.Handlebars.compile('<input type="checkbox" />');
		this._initializePropertyPanel();
		this._initializeToolbar();
		this._initializeFooter();

		$('body').addClass('t3-backend');
	},

	_initializePropertyPanel: function() {
		$('body').append($('<div class="t3-rightarea aloha-block-do-not-deactivate" id="t3-ui-rightarea"></div>'));

		var propertyPanelView = SC.View.create({
			template: SC.Handlebars.compile('<form class="t3-propertypanel-form" action="#"> {{#collection tagName="fieldset" classNames="t3-propertypanel-section" contentBinding="ContentModule.CurrentlyActivatedBlockSchema.schema"}}<h2>{{content.key}}</h2> {{collection ContentModule.ActivatedBlockSchemaProperties tagName="div" classNames="t3-propertypanel-field" contentBinding="parentView.content.properties"}} {{/collection}} </form>'),
			selectPropertyEditingWidget: function() {
				return 'test';
			}
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

ContentModule.CurrentlyActivatedBlockSchema = SC.Object.create({
	schema: [],

	setCurrentSchema: function(schema) {
		if (schema === null || schema === undefined) {
			schema = [];
		}
		this.set('schema', schema);
	}
});

ContentModule.ActivatedBlockSchemaProperties = SC.CollectionView.extend({
	 itemViewClass: SC.View.extend({
        templateName: function() {
			  var content = this.get('content');
			  console.log(content);
			  if (content.type === 'string') {
				  return 'ContentModule.templatePropertyString';
			  } else {
				  return 'ContentModule.templateTest';
			  }
			  
        }.property('type')
    })

});

ContentModule.SchemaPropertiesView = SC.View.extend({

	schemaTypeSelector: function() {
		var content = this.get('content');
		if (content.type === 'string') {
			return SC.TextField.extend();
		} else {
			return '';
		}


	}.property('type')
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