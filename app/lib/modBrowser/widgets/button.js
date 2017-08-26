module.exports = {
	
	renderWidget : function(param, fn) {
		if(typeof param.buttons != 'undefined') {
			// multi buttons
			var html = '';
			var buttons = param.buttons;
			var cols = param.cols || 3;
			html += '<div>';
			for(var i = 0; i < buttons.length; i++) {
				var btn = buttons[i];
				var visibility = typeof btn.visibility != 'undefined' && !btn.visibility ? 'hidden' : 'visible';
				html += '<input type="button" id="' + btn.name + '" value="' + btn.title + '" style="visibility:' + visibility + '"/>';
				if((i + 1) % cols == 0 && i < buttons.length - 1) {
					html += '</div><div>';
				}
			}
			html += '</div>';
			fn(html);
		}
		else {
			var visibility = typeof param.visibility != 'undefined' && !param.visibility ? 'hidden' : 'visible';
			var html = '<input type="button" id="' + param.name + '" value="' + param.title + '" style="visibility:' + visibility + ';width:100%;"/>';
			fn(html);
		}
	}
}
