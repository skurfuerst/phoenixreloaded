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

				Aloha.bind("aloha-editable-deactivated", function() {
					PhoenixPlugin._onModification.apply(PhoenixPlugin, arguments);
				});
				Aloha.bind("aloha-smart-content-changed", function() {
					PhoenixPlugin._onModification.apply(PhoenixPlugin, arguments);
				});
        	});
        },
		_onModification: function(event, editable) {
			ContentModule.ChangesController.addChange(editable);
		},
        destroy: function() {
        }
    });
	return PhoenixPlugin;
});