require("typesjs");
function CrTypeKeyBoard(){
	var T = Object.types;
	
	var Type = T.any({
		action: "Move",
		dir: T.pos(4)
	}, {action: "Fire"});

	return function(val){
		if(Type.test(val)) throw Type.test(val);
		return val;
	}
}

function CrTypeDisplay(){
	var T = Object.types;
	var Type = T.any({
			action: "Create",
			type: "Map",
			size: T.pos(64),
		},{
			action: "Dell",
			type: "Map"
		},{
			action: "Create",
			type: T.any("Gamer", "Bullet"),
			id: T.pos(64),
			
		}, {
			action: "Update",
			type: T.any("Gamer", "Bullet")
		},{
			action: "Dell",
			type: T.any("Gamer", "Bullet"),
			id: T.pos(64),
		},{
			action: "Stat",
			data: {}
		});
	
	
	return function(val){
		if(Type.test(val)) throw Type.test(val);
		return val;
	}
}

module.exports = [CrTypeKeyBoard(), CrTypeDisplay()];
