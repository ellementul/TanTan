require("typesjs");
require("typesjs/str_type");

var T = Object.types;
var types = require("./Types.js");

function CrTypesKeyboard(){
	var TypeWalk = T.obj({
		action: "Move",
		dir: T.pos(4)
	});

	var TypeFire = T.obj({
		action: "Fire"
	});


	return function(mess){
		switch(mess.action){
			case "Move":
				ValidError(TypeWalk.test, mess); 
				break;
			case "Fire":
				ValidError(TypeFire.test, mess); 
				break;
		}
		return mess;
	}
}

function CrTypesDisplay(){
	
	
	var CreateMapType = T.obj({
		action: "Create",
		type: "Map",
		size: types.map_size
	});

	var CreateObjType = T.obj({
		action: "Create",
		type: T.any("Gamer", "Bullet"),
		id: types.obj_id,
		sprite: T.str(/^[\w\d]*$/, 50),
		box: types.box,
		pos: types.position,
		dir: types.direction
	});

	var UpdateObjType = T.obj({
		action: "Update",
		type: T.any("Gamer", "Bullet"),
		id: types.obj_id,
		box: T.any(undefined, types.box),
		pos: types.position,
		dir: types.direction
	});

	var DelObjType = T.obj({
			action: "Dell",
			type: T.any("Gamer", "Bullet"),
			id: types.obj_id,
	});

	// var DelMapType = T.obj({
	// 		action: "Dell",
	// 		type: "Map"
	// });

	return function(mess){
		if(mess.type == "Map" && mess.action == "Create")
			ValidError(CreateMapType.test, mess);
		else
			switch(mess.action){
				case "Create":
					ValidError(CreateObjType.test, mess);
					break;
				case "Update":
					ValidError(UpdateObjType.test, mess);
					break;
				case "Dell":
					ValidError(DelObjType.test, mess); 
					break;
			}
		return mess;
	}
}

function ValidError(test, val){
	if(test(val))
		throw new Error(JSON.stringify({type: test(val), value: val}, "", 4));
}

module.exports = [CrTypesKeyboard(), CrTypesDisplay()];