module.exports = {
	
	renderWidget : function(param, fn) {
		if(typeof param.buttons != 'undefined') {
			// multi buttons
			var html = '';
			var buttons = param.buttons;
			html += '<div>';
			for(var i = 0; i < buttons.length; i++) {
				var btn = buttons[i];
				html += '<input type="button" id="' + btn.name + '" value="' + btn.title + '"/> ';
			}
			html += '</div>';
			fn(html);
		}
		else {
			var html = '<input type="button" id="' + param.name + '" value="' + param.title + '"/>';
			fn(html);
		}
	}
}
