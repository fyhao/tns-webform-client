module.exports = {
	
	renderWidget : function(param, fn) {
		if(typeof param.buttons != 'undefined') {
			// multi buttons
			var html = '';
			var buttons = param.buttons;
			html += '<div>';
			for(var i = 0; i < buttons.length; i++) {
				var btn = buttons[i];
				var visibility = typeof btn.visibility != 'undefined' && btn.visibility ? 'visible' : 'hidden';
				html += '<input type="button" id="' + btn.name + '" value="' + btn.title + '" style="visibility:' + visibility + '"/>';
			}
			html += '</div>';
			fn(html);
		}
		else {
			var visibility = typeof param.visibility != 'undefined' && param.visibility ? 'visible' : 'hidden';
			var html = '<input type="button" id="' + param.name + '" value="' + param.title + '" style="visibility:' + visibility + '"/>';
			fn(html);
		}
	}
}
