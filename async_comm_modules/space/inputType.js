const T = require("typesjs");

const _mapSize = 1024;

const success = T.Bool.Def();

const source = T.Any.Def(T.Key.Def());

const uid = T.String.Def('\\w\\d-', 36);

const id = T.Any.Def(uid, T.Key.Def());

const type = T.Key.Def();

const position = T.Number.Def(_mapSize, 0, 2);

const coords = T.Object.Def({
	x: position, 
	y: position,
});

const speed = position;

const sizes = T.Object.Def({
	w: position, 
	h: position,
});

const box = T.Object.Def({
	type: "Box", 
	size: sizes,
});


//==================Types of Messeges======================


let switchKey = "action";


let Types = [{
	action: "Add",
	type: T.Const.Def("Wall"),
	id: uid,
	coords,
	collisFig: box,
	idImage: uid,
},{
	action: "Load",
	type: T.Const.Def("World"),
},{
	action: "Connected",
	adress: T.Key.Def(),
}];

module.exports = T.Switch.Def(switchKey, Types);