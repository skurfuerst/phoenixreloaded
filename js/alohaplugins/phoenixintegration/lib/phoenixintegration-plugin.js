define(
['core/plugin', 'phoenixintegration/block'],
function(Plugin, block) {
    "use strict";

    return Plugin.create('phoenixintegration', {
    	dependencies: ['block'],
        init: function() {
        	require(['block/blockmanager'], function(BlockManager) {
				BlockManager.registerBlockType('TextBlock', block.TextBlock);
				BlockManager.registerBlockType('PluginBlock', block.PluginBlock);
        		BlockManager.bind('block-selection-change', ContentModule._onBlockSelectionChange, ContentModule);
        	});
        },
        destroy: function() {
        }
    });
});