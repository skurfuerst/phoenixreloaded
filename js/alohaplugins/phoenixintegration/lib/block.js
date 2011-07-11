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
			/*addAboveHandle.click(function() {
				// TODO implement
				return false;
			});*/

			var addBelowHandle = $('<span class="t3-add-below-handle">Add below</span>');
			this.element.prepend(addBelowHandle);
			/*addBelowHandle.click(function() {
				// TODO implement
				return false;
			});*/
			if (this.attr('_status')) {
				// FIXME: do not output _status directly, but do it using CSS or localization.
				var statusIndicator = $('<span class="t3-status-indicator t3-status-indicator-' + this.attr('_status')  + '">' + this.attr('_status') + '</span>');
				this.element.prepend(statusIndicator);
			}
		}
	});

	// TODO: should be generic lateron.
	exports.TextBlock = exports.AbstractBlock.extend({
		title: 'Text',

		init: function() {
			this.attr('title', this.element.find('h1').html(), true);
			this.attr('content', this.element.find('.t3-content').html(), true);
		},
		render: function(element) {
			return '<h1 class="aloha-editable" data-propertyname="title">' + this.attr('title') + '</h1><div class="t3-content aloha-editable"  data-propertyname="content">' + this.attr('content') + '</div>'; // TODO: use templateable block here
		},
		getSchema: function() {
			return [
				{
					key: 'Access',
					properties: [
						{
							key: 'visibility',
							type: 'boolean',
							label: 'Visibility'
						}
					]
				}
			];
		}
	});

	exports.PluginBlock = exports.AbstractBlock.extend({
		title: 'Plugin',
		getSchema: function() {
			return [
				{
					key: 'Plugin Settings',
					properties: [
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
					properties: [
						{
							key: 'visibility',
							type: 'boolean',
							label: 'Visibility'
						}
					]
				}
			];
		}
	});
	return exports;
});