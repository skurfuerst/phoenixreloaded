var ContentModule = SC.Application.create({
	_bootstrap: function() {
		this._initializePropertyPanel();
		this._initializeToolbar();
		this._initializeFooter();
		this._initializeLauncher();

		 // TODO: should be only set when header and property panel is visible
		$('body').addClass('t3-ui-controls-active');
		$('body').addClass('t3-backend');
	},

	_initializePropertyPanel: function() {
		$('body').append($('<div class="t3-ui t3-rightarea aloha-block-do-not-deactivate" id="t3-ui-rightarea"></div>'));

		var propertyPanelView = SC.View.create({
			template: SC.Handlebars.compile('\
<form class="t3-propertypanel-form" action="#">\
  {{#collection tagName="fieldset" classNames="t3-propertypanel-section" contentBinding="ContentModule.BlockSelectionController.selectedBlockSchema"}}\
	<h2>{{content.key}}</h2>\
    {{#collection tagName="div" classNames="t3-propertypanel-field" contentBinding="parentView.content.properties"}}\
      <label for="">{{content.label}}</label>\
      {{propertyEditWidget noMatterWhatITypeHere}}\
    {{/collection}}\
  {{/collection}} \
</form>')
		});
		propertyPanelView.appendTo($('.t3-rightarea'));
	},

	_initializeToolbar: function() {
		var toolbar = ContentModule.Toolbar.create({
			elementId: 't3-toolbar',
			classNames: ['t3-ui'],
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

	_initializeLauncher: function() {
		var launcher = T3.Common.Launcher.create({
			modulesBinding: 'T3.Common.ModulesController.filteredModules',
			valueBinding: 'T3.Common.ModulesController.filterValue'
		});
		// FIXME Just a fixture, use remote loading or JSON injection of available modules
		var modules = [
			{
				label: 'Users',
				url: '/users'
			},
			{
				label: 'Templates',
				url: '/templates'
			},
			{
				label: 'Configuration',
				url: '/configuration'
			},
			{
				label: 'Asset management',
				url: '/asset_management'
			}
		];
		T3.Common.ModulesController.setAvailableModules(modules);
		launcher.appendTo($('#t3-ui-top'));
	},

	_initializeFooter: function() {
		var breadcrumb = ContentModule.Breadcrumb.extend({
			contentBinding: 'ContentModule.BlockSelectionController.blocks'
		});
		var footer = ContentModule.Toolbar.create({
			elementId: 't3-footer',
			classNames: ['t3-ui'],
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

var T3 = window.T3 || {};
T3.Common = T3.Common || {};

T3.Common.ModulesController = SC.Object.create({
	availableModules: [],
	filterValue: null,
	filteredModules: [],
	setAvailableModules: function(modules) {
		var wrappedModules = modules.map(function(module) {
			return SC.Object.create(module);
		});
		this.set('availableModules', wrappedModules);
		this.set('filteredModules', wrappedModules);
	},
	_filterValueChange: function() {
		var lcFilterValue = this.get('filterValue').toLowerCase();
		if (lcFilterValue === '') {
			this.set('filteredModules', this.get('availableModules'));
		} else {
			this.set('filteredModules', this.get('availableModules').filter(function(module) {
				return module.get('label').toLowerCase().indexOf(lcFilterValue) >= 0;
			}, this));
		}
	}.observes('filterValue')
});

T3.Common.Launcher = SC.View.extend({
	tagName: 'div',
	classNames: ['t3-launcher'],
	value: '',
	open: false,
	template: SC.Handlebars.compile('<div class="t3-launcher-container">{{view T3.Common.Launcher.TextField openBinding="parentView.open" valueBinding="parentView.value" placeholder="Do what you want." }}</div><div class="t3-launcher-logo"></div>{{view T3.Common.Launcher.Panel openBinding="parentView.open" modulesBinding="parentView.modules"}}')
});

T3.Common.Launcher.TextField = SC.TextField.extend({
	cancel: function() {
		this.set('value', '');
		this.$().blur();
	},
	focusIn: function() {
		this.set('value', '');
		this.set('open', true);
	},
	focusOut: function() {
		this.set('open', false);
		this._super();
	},
	keyDown: function(event) {
		// TODO Move to controller
		if (event.keyCode === 9) {
			this.$().closest('.t3-launcher').find('.t3-launcher-panel-modules li:first-child a').first().focus();
			return false;
		}
	}
});

T3.Common.Launcher.Panel = SC.View.extend({
	tagName: 'div',
	classNames: ['t3-launcher-panel'],
	classNameBindings: ['open'],
	isVisible: false,
	open: false,
	focussed: false,
	templateName: 'launcher-panel',
	_openDidChange: function() {
		var that = this;
		// Delay the execution a bit to give the focus change a chance
		setTimeout(function() {
			var open = that.get('open');
			if (open) {
				that.$().slideDown('fast');
			} else {
				if (that.get('focussed')) return;
				that.$().slideUp('fast');
			}
		}, 50);
	}.observes('open'),
	focusIn: function() {
		this.set('focussed', true);
	},
	focusOut: function() {
		this.set('focussed', false);
	}
});

ContentModule.Breadcrumb = SC.View.extend({
	tagName: 'div',
	classNames: ['t3-breadcrumb', 'aloha-block-do-not-deactivate'],
	template: SC.Handlebars.compile('\
<div class="t3-breadcrumb-page">\
  {{view ContentModule.Breadcrumb.Page}}\
</div>\
{{#collection contentBinding="parentView.content" tagName="ul"}}\
  {{view ContentModule.Breadcrumb.Item itemBinding="parentView.content"}}\
{{/collection}}')
});

ContentModule.Breadcrumb.Item = SC.View.extend({
	tagName: 'a',
	href: '#',
	// TODO Don't need to bind here actually
	attributeBindings: ['href'],
	template: SC.Handlebars.compile('{{item._title}}'),
	click: function(event) {
		var item = this.get('item');
		ContentModule.BlockSelectionController.selectItem(item);
		event.stopPropagation();
		return false;
	}
});

ContentModule.Breadcrumb.Page = ContentModule.Breadcrumb.Item.extend({
	id: 't3-page',
	title: 'test',
	tagName: 'a',
	href: '#',
	// TODO Don't need to bind here actually
	attributeBindings: ['href'],
	template: SC.Handlebars.compile('{{view ContentModule.Button label="Inspect"}} Page'),
	click: function(event) {
		ContentModule.BlockSelectionController.selectPage();
		event.stopPropagation();
		return false;
	},

	getSchema: function() {
		return [{
					key: 'Main',
					properties: [
						{
							key: 'title',
							type: 'string',
							label: 'Package'
						}
					]
				}];
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
	}.property('icon').cacheable()
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
		var i = 0, count = 5, allDone = function() {
			i++;
			if (i >= count) {
				if (pressed) {
					$('body').removeClass('t3-ui-controls-active');
				} else {
					$('body').addClass('t3-ui-controls-active');
				}
			}
		};
		if (pressed) {
			$('body').animate({
				'margin-top': 30,
				'margin-right': 0
			}, 'fast', allDone);
			$('#t3-footer').animate({
				height: 0
			}, 'fast', allDone);
			$('#t3-toolbar').animate({
				top: 0,
				right: 0
			}, 'fast', allDone);
			$('#t3-ui-top').slideUp('fast', allDone);
			$('#t3-ui-rightarea').animate({
				width: 0
			}, 'fast', allDone);
		} else {
			$('body').animate({
				'margin-top': 55,
				'margin-right': 200
			}, 'fast', allDone);
			$('#t3-footer').animate({
				height: 30
			}, 'fast', allDone);
			$('#t3-toolbar').animate({
				top: 45,
				right: 200
			}, 'fast', allDone);
			$('#t3-ui-top').slideDown('fast', allDone);
			$('#t3-ui-rightarea').animate({
				width: 200
			}, 'fast', allDone);
		}
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

ContentModule.BlockSelectionController = SC.Object.create({
	blocks: [],

	/**
	 * Update the selection. If we have a block activated, we add the CSS class "t3-contentelement-selected" to the body
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
			blocks = $.map(blocks, function(alohaBlock) {
				return ContentModule.BlockManager.getBlockProxy(alohaBlock);
			});
		}
		this.set('blocks', blocks);
		this._updating = false;
	},

	selectedBlock: function() {
		var blocks = this.get('blocks');
		return blocks.length > 0 ? blocks[0]: null;
	}.property('blocks').cacheable(),

	selectedBlockSchema: function() {
		var selectedBlock = this.get('selectedBlock');
		if (!selectedBlock) return;
		return selectedBlock.get('schema');
	}.property('selectedBlock').cacheable(),

	selectPage: function() {
		Aloha.Block.BlockManager._deactivateActiveBlocks();

		var blocks = [
			new ContentModule.Breadcrumb.Page()
		];

		this.updateSelection(blocks);
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

ContentModule.Block = SC.Object.extend({
	alohaBlockId: null,
	_title:null,
	schema: function() {
		var alohaBlock = Aloha.Block.BlockManager.getBlock(this.get('alohaBlockId'));
		return alohaBlock.getSchema();
	}.property()
});

ContentModule.BlockManager = SC.Object.create({
	_blocks: {},
	/**
	 * @param block/block Aloha Block instance
	 */
	getBlockProxy: function(alohaBlock) {
		var blockId = alohaBlock.getId();
		if (this._blocks[blockId]) {
			return this._blocks[blockId];
		}
		var blockProxy = ContentModule.Block.create({
			alohaBlockId: blockId,
			_title: alohaBlock.title
		});
		var attributes = alohaBlock.attr();
		$.each(attributes, function(key, value) {
			blockProxy.set(key, value);
		});

		this._blocks[blockId] = blockProxy;
		return this._blocks[blockId];
	}
});

SC.$(document).ready(function() {
	ContentModule._bootstrap();
});

Handlebars.registerHelper('propertyEditWidget', function(x) {
	var contextData = this.get('content');

	var block = ContentModule.BlockSelectionController.get('selectedBlock');

	var classPath = ContentModule.propertyTypeMap[contextData.type];

//	var val = block.get(contextData.key);
//	console.log("oldVal", block, val);

	// todo: understand all options and clean
	var options = {
		data: {
			view: this
		},
		hash: {
			'class': contextData.key,
				// todo: set block attributes into SC object to bind value here
			//value: val,
			/*theValueChange: function() {
				//console.log(block.get(contextData.key), "XX");
				//var val = this.get('value');
				//console.log(block);
				//block.set(contextData.key, val);
			}.observes('value')*/
			valueBinding: "ContentModule.BlockSelectionController.selectedBlock." + contextData.key //block.get(contextData.key)
		}
	};

	return SC.Handlebars.ViewHelper.helper(this, classPath, options);
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
