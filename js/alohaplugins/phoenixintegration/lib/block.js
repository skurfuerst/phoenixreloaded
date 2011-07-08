define(
['block/block'],
function(block) {
    "use strict";
	var exports = {};

	exports.AbstractBlock = block.DefaultBlock.extend({
		renderToolbar: function() {
			var that = this;
			var addAboveHandle = $('<span class="t3-add-above-handle">Add above</span>');
			this.element.prepend(addAboveHandle);
			addAboveHandle.click(function() {
				// TODO implement
				return false;
			});

			var addBelowHandle = $('<span class="t3-add-below-handle">Add below</span>');
			this.element.prepend(addBelowHandle);
			addBelowHandle.click(function() {
				// TODO implement
				return false;
			});
		}
	});

	// TODO: should be generic lateron.
	exports.TextBlock = exports.AbstractBlock.extend({
		title: 'Text',
		getSchema: function() {
			return null;
		}
	});

	exports.PluginBlock = exports.AbstractBlock.extend({
		title: 'Plugin',
		getSchema: function() {
			return {
				/*visible: {
					type: 'string', // TODO: boolean
					label: 'Visible'
				},*/
				'package': {
					type: 'string',
					label: 'Package'
				},
				'controller': {
					type: 'string',
					label: 'Controller'
				}
			};
		}
	});
	return exports;
});