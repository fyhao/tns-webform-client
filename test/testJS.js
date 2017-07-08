var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'asyncFlow',flow:'submain'},
					{type:'log','log':'1: ##a##'},
					{type:'waitUntil',var:'a',value:3},
					{type:'log','log':'2: ##a##'},
				]
			},
			flows : {
				submain: {
					steps: [
						{type:'setVar',name:'a',value:1},
						{type:'asyncFlow',flow:'subflow',delay:1},
						{type:'waitUntil',var:'a',value:2},
						{type:'setVar',name:'a',value:3},
						// #187 waitUntil success when a variable value changed from 1 to 2 then after that change to 1, test few scenarios on tick time, and the time between changing value
						{type:'wait',timeout:1000},
						{type:'setVar',name:'a',value:2}
					]
				},
				subflow: {
					steps : [
						{type:'setVar',name:'a',value:2},
					]
				}
			}
		};
		
console.log(JSON.stringify(webform));