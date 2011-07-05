define(
['core/plugin'],
function(Plugin) {
    "use strict";

    return Plugin.create('phoenixintegration', {
        init: function() {
			$('.typo3-contentelement').alohaBlock();
            // Executed on plugin initialization
        },
        destroy: function() {
            // Executed when this plugin is unloaded
        }
    });
});