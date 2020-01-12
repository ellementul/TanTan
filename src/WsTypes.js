const T = require("typesjs");
const types = require("./Types.js");

function CrTypesKeyboard(){

	let typeMesgs = T.Switch.Def("action", 
		[{
			action: "ReadyLoad",
			type: T.Any.Def(T.Const.Def("Tiles"), T.Const.Def("Map")),
		},{
			action: "Move",
			dir: types.direction
		},{
			action: "Fire"
		}]
	);

	return function(mess){
		ValidError(typeMesgs.test, mess);
		return mess;
	}
			
}

function CrTypesDisplay(){

	let TileType = T.Object.Def({
		id: types.obj_id,
		images: T.Array.Def(T.String.Def('\\w\\d\\s+:;.,?!=#\\/<>"()-\\]}{', 1024*1024-1), 1),
		type: T.Any.Def(T.Const.Def("steel")),
		size: T.Index.Def(types.map_size)
	});
	
	let typeMesgs = T.Switch.Def(["action", "type"],
		[{
			action: "Update",
			type: "GUI",
			setBackground: types.path,
		},/*{
			action: "Create",
			type: "Map",
			size: T.Index.Def(types.map_size)
		},{
			action: "Create",
			type: "Actor",
			actor_type: T.Key.Def(),
			id: types.obj_id,
			sprite: types.obj_id,
			box: types.box,
			pos: types.position,
			dir: types.direction
		},{
			action: "Update",
			type: "Actor",
			actor_type: T.Key.Def(),
			id: types.obj_id,
			box: T.Any.Def(types.box),
			pos: types.position,
			dir: types.direction
		},{
			action: "Dell",
			type: "Actor",
			actor_type: T.Key.Def(),
			id: types.obj_id,
		},{
			action: "Add",
			type: "Tiles",
			tile: TileType
		},{
			action: "Create",
			type: "Tiles",
			tiles: T.Array.Def(TileType, 64, false)
		},{
			action: "Update", 
			type: "GUI", 
			data: T.Any.Def( 
				T.Object.Def({
					Status: T.String.Def("\w\d\s", 50), 
					login: T.String.Def("\w\d", 50),
				}), 
				T.Object.Def({
					Status: T.Any.Def(T.Const.Def("Play"), T.Const.Def("Win"), T.Const.Def("Lose")),
					Winner: T.Any.Def(T.String.Def("\w\d", 50)),
		            life: T.Index.Def(1024),
		            deaths: T.Index.Def(1024),
		            kills: T.Index.Def(1024)
				})
			)
		}*/]
	);

	return function(mess){
		ValidError(typeMesgs.test, mess);
		return mess;
	}
}

function ValidError(test, val){
	if(test(val))
		throw new Error(JSON.stringify({type: test(val), value: val}, "", 4));
}

module.exports = [CrTypesKeyboard(), CrTypesDisplay()];