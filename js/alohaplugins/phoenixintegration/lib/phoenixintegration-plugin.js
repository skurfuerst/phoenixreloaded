define(
['core/plugin', 'phoenixintegration/block'],
function(Plugin, block) {
    "use strict";

    var PhoenixPlugin = Plugin.create('phoenixintegration', {
    	dependencies: ['block'],
        init: function() {
        	require(['block/blockmanager'], function(BlockManager) {
				var that = this;
				BlockManager.registerBlockType('TextBlock', block.TextBlock);
				BlockManager.registerBlockType('PluginBlock', block.PluginBlock);
        		BlockManager.bind('block-selection-change', ContentModule._onBlockSelectionChange, ContentModule);

				Aloha.bind("aloha-editable-deactivated", function(event, data) {
					var editable = data.editable;
					if (!editable || !editable.isModified()) {
						return;
					}

					ContentModule.ChangesController.addChange(editable);
				});
				Aloha.bind("aloha-smart-content-changed", function(event, data) {
					var editable = data.editable;
					if (!editable || !editable.isModified()) {
						return;
					}

					ContentModule.ChangesController.addChange(editable);
				});
        	});
        },
		destroy: function() {
        }
    });
	return PhoenixPlugin;
});