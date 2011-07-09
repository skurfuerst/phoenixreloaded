var ContentModule = SC.Application.create({
	_bootstrap: function() {
		SC.TEMPLATES['ContentModule.templateProperty_string'] = SC.Handlebars.compile('<input type="text" value="{{currentData}}" />');
		SC.TEMPLATES['ContentModule.templateProperty_boolean'] = SC.Handlebars.compile('<input type="checkbox" />');
		this._initializePropertyPanel();
		this._initializeToolbar();
		this._initializeFooter();

		$('body').addClass('t3-ui-controls-active'); // TODO: should be only set when header and property panel is visible

		$('body').addClass('t3-backend');
	},

	_initializePropertyPanel: function() {
		$('body').append($('<div class="t3-rightarea aloha-block-do-not-deactivate" id="t3-ui-rightarea"></div>'));

		var propertyPanelView = SC.View.create({
			template: SC.Handlebars.compile('<form class="t3-propertypanel-form" action="#"> {{#collection tagName="fieldset" classNames="t3-propertypanel-section" contentBinding="ContentModule.BlockSelectionController.selectedBlock.schema"}}<h2>{{content.key}}</h2> {{#collection tagName="div" classNames="t3-propertypanel-field" contentBinding="parentView.content.properties"}} <label for="">{{content.label}}</label> {{propertyEditWidget content}} {{/collection}} {{/collection}} {{#view SC.Button}}Save{{/view}} {{#view SC.Button}}Reset{{/view}}</form>')

		});
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
					label: 'Revert',
					disabledBinding: 'ContentModule.ChangesController.noChanges',
					target: 'ContentModule.ChangesController',
					action: 'revert'
				}),
				ContentModule.MenuSeparator,
				ContentModule.Button.extend({
					label: 'Save',
					disabledBinding: 'ContentModule.ChangesController.noChanges'
				})
			]
		});
		toolbar.appendTo($('body'));
	},

	_initializeFooter: function() {
		var breadcrumb = ContentModule.Breadcrumb.extend({
			contentBinding: 'ContentModule.BlockSelectionController.blocks'
		});
		var footer = ContentModule.Toolbar.create({
			elementId: 't3-footer',
			left: [
				breadcrumb
			]
		});
		footer.appendTo($('body'));
	},

	_onBlockSelectionChange: function(blocks) {
		ContentModule.BlockSelectionController.updateSelection(blocks);
	}
});

ContentModule.Breadcrumb = SC.View.extend({
	tagName: 'div',
	classNames: ['t3-breadcrumb', 'aloha-block-do-not-deactivate'],
	template: SC.Handlebars.compile('<div class="t3-breadcrumb-page">{{view ContentModule.Breadcrumb.Page}}</div>{{#collection contentBinding="parentView.content" tagName="ul"}}{{view ContentModule.Breadcrumb.Item itemBinding="parentView.content"}}{{/collection}}')
});

ContentModule.Breadcrumb.Item = SC.View.extend({
	tagName: 'a',
	href: '#',
	// TODO Don't need to bind here actually
	attributeBindings: ['href'],
	template: SC.Handlebars.compile('{{item.title}}'),
	click: function(event) {
		var item = this.get('item');
		ContentModule.BlockSelectionController.selectItem(item);
		event.stopPropagation();
		return false;
	}
});

ContentModule.Breadcrumb.Page = ContentModule.Breadcrumb.Item.extend({
	tagName: 'a',
	href: '#',
	// TODO Don't need to bind here actually
	attributeBindings: ['href'],
	template: SC.Handlebars.compile('{{view ContentModule.Button label="Inspect"}} Page'),
	click: function(event) {
		ContentModule.BlockSelectionController.selectPage();
		event.stopPropagation();
		return false;
	}
});

ContentModule.MenuSeparator = SC.View.extend({
	tagName: 'div',
	classNames: ['t3-menu-separator']
});

ContentModule.Toolbar = SC.View.extend({
	tagName: 'div',
	classNames: ['t3-toolbar', 'aloha-block-do-not-deactivate'],
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
	}.property('length'),

	revert: function() {
		this.set('[]', []); // Reset all changes
		window.location.reload();
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

ContentModule.BlockSelectionController = SC.Object.create({
	blocks: [],

	/**
	 * Update the selection. If we have a block activated, we add the CSS class "t3-contentelement-selected to the body
	 * so that we can modify the appearance of the block handles.
	 */
	updateSelection: function(blocks) {
		if (this._updating) {
			return;
		}
		this._updating = true;

		if (blocks === undefined || blocks === null || blocks === [] || blocks.length == 0) {
			blocks = [];
			$('body').removeClass('t3-contentelement-selected');
		} else {
			$('body').addClass('t3-contentelement-selected');
		}
		if (blocks.length > 0 && typeof blocks[0].getSchema !== 'undefined') {
			blocks = $.map(blocks, function(block) {
				return SC.Object.create({
					id: block.id,
					title: block.title,
					schema: block.getSchema()
				});
			});
		}
		this.set('blocks', blocks);
		this._updating = false;
	},

	getSelectedBlock: function() {
		var blocks = this.get('blocks');
		return blocks.length > 0 ? SC.Object.create(blocks[0]): null;
	},

	selectedBlock: function() {
		var blocks = this.get('blocks');
		return blocks.length > 0 ? SC.Object.create(blocks[0]): null;
	}.property('blocks'),

	selectPage: function() {
		Aloha.Block.BlockManager._deactivateActiveBlocks();
	},

	selectItem: function(item) {
		var block = Aloha.Block.BlockManager.getBlock(item.id);
		if (block) {
			// FIXME !!! This is to prevent the event triggering a refresh of the blocks which trigger an event and kill the selection
			this._updating = true;
			block.activate();
			this._updating = false;
		}
	}
});

ContentModule.propertyTypeMap = {
	'boolean': 'SC.Checkbox',
	'string': 'SC.TextField'
};

SC.$(document).ready(function() {
	ContentModule._bootstrap();
});

Handlebars.registerHelper('propertyEditWidget', function(propertySchema) {
	var contextData = this.get('content');
	var block = Aloha.Block.BlockManager.getBlock(ContentModule.BlockSelectionController.getSelectedBlock().id);

	var path = ContentModule.propertyTypeMap[contextData.type];
	// todo: understand all options and clean
	options = {
		data: {
			view: this
		},
		hash: {
			class: contextData.key,
				// todo: set block attributes into SC object to bind value here
			value: block.attr(contextData.key)
		}

	};

	return SC.Handlebars.ViewHelper.helper(this, path, options);
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
