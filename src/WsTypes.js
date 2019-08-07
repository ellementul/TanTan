require("typesjs");
require("typesjs/str_type");

var T = Object.types;
var types = require("./Types.js");

function CrTypesKeyboard(){
	var TypeReadyTiles = T.obj({
		action: "ReadyLoad",
		type: T.any("Tiles", "Map")
	});

	var TypeWalk = T.obj({
		action: "Move",
		dir: types.direction
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
			case "ReadyLoad":
				ValidError(TypeReadyTiles.test, mess); 
				break;
			default: ValidDefault(mess);
		}
		return mess;
	}
}

function CrTypesDisplay(){
	
	
	var CreateMapType = T.obj({
		action: "Create",
		type: "Map",
		size: T.pos(types.map_size)
	});

	var CreateActorType = T.obj({
		action: "Create",
		type: "Actor",
		actor_type: T.str(/^[\w\d]*$/, 50),
		id: types.obj_id,
		sprite: types.obj_id,
		box: types.box,
		pos: types.position,
		dir: types.direction
	});

	var UpdateActorType = T.obj({
		action: "Update",
		type: "Actor",
		actor_type: T.str(/^[\w\d]*$/, 50),
		id: types.obj_id,
		box: T.any(undefined, types.box),
		pos: types.position,
		dir: types.direction
	});

	var DelActorType = T.obj({
			action: "Dell",
			type: "Actor",
			actor_type: T.str(/^[\w\d]*$/, 50),
			id: types.obj_id,
	});

	var TileType = T.obj({
			id: types.obj_id,
			images: T.arr(T.str(/^[\w\d\s+:;.,?!=#\/<>"()-\]}{]*$/, 1024*1024)),
			type: T.any("steel"),
			size: T.pos(types.map_size)
	});

	var AddTileType = T.obj({
		action: "Add",
		type: "Tiles",
		tile: TileType
	});

	var TilesType = T.obj({
		action: "Create",
		type: "Tiles",
		tiles: T.arr(TileType, 64, false)
	});

	var UpdateGUIStatus = T.obj({
		action: "Update", 
		type: "GUI", 
		data: T.any({
			Status: T.str(/^[\w\d\s]*$/, 50), 
			login: T.str(/^[\w\d]*$/, 50),
		},{
			Status: T.any("Play", "Win", "Lose"),
			Winner: T.any(undefined, T.str(/^[\w\d]*$/, 50)),
            life: T.pos(1024),
            deaths: T.pos(1024),
            kills: T.pos(1024)
		})
	});

	// var DelMapType = T.obj({
	// 		action: "Dell",
	// 		type: "Map"
	// });

	return function(mess){
		switch(mess.type){
			case "Map":
				switch(mess.action){
					case "Create": ValidError(CreateMapType.test, mess); break;
					default: ValidDefault(mess);
				} break;
			case "GUI":
				switch(mess.action){
					case "Update": ValidError(UpdateGUIStatus.test, mess); break;
					default: ValidDefault(mess);
				} break;
			case "Tiles":
				switch(mess.action){
					case "Create": ValidError(TilesType.test, mess); break;
					case "Add": ValidError(AddTileType.test, mess); break;
					default: ValidDefault(mess);
				} break;
			case "Actor":
				switch(mess.action){
					case "Create": ValidError(CreateActorType.test, mess); break;
					case "Update": ValidError(UpdateActorType.test, mess); break;
					case "Dell": ValidError(DelActorType.test, mess); break;
					default: ValidDefault(mess);
				} break;
			default: ValidDefault(mess);
		}
		
		return mess;
	}
}

function ValidError(test, val){
	if(test(val))
		throw new Error(JSON.stringify({type: test(val), value: val}, "", 4));
}

function ValidDefault(val){
	throw new Error(JSON.stringify({type: "unknowed type", value: val}, "", 4));
}

module.exports = [CrTypesKeyboard(), CrTypesDisplay()];