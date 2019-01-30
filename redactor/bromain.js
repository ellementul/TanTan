const Vue = require("vue");

var Tools = new Vue({
	el: '#tools',
	data: {
		tools: [
			"brush",
			"fill",
			"setting"
		]
	}
})

var Blocks = new Vue({
	el: '#blocks',
	data: {
		cats: [
			{
				name: "Cats1",
				vis: true,
				blocks: new Array(50)
			},
			{
				name: "Cats2",
				vis: true,
				blocks: new Array(50)
			}
		]
		
	},
	methods: {
		show: function(){
			var i = event.target.getAttribute("index");
			this.cats[i].vis = !this.cats[i].vis;
		}
	}
})
