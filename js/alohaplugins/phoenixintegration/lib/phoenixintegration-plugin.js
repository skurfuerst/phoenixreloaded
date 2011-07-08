define(
['core/plugin'],
function(Plugin) {
    "use strict";

    return Plugin.create('phoenixintegration', {
    	dependencies: ['block'],
        init: function() {
        	require(['block/blockmanager'], function(BlockManager) {
        		BlockManager.bind('block-selection-change', ContentModule._onBlockSelectionChange, ContentModule);
        	});
            // Executed on plugin initialization
        },
        destroy: function() {
            // Executed when this plugin is unloaded
        }
    });
});