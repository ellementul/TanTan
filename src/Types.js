
const T = require("typesjs");

const _mapSize = 1024;

const uid = T.String.Def('\\w\\d-', 36);

const path = T.Array.Def(T.String.Def('\\w\\d_.', 256), 256);

const resource = T.Object.Def({ id: uid,  fullPath: path});

const position = T.Number.Def(_mapSize, 0, 2);

const direction = T.Number.Def(1, -1, 0);

const coords = T.Object.Def({
	x: position, 
	y: position,
});

const speed = position;

const sizes = T.Object.Def({
	w: position, 
	h: position,
});

const actor = T.Object.Def({
	id: uid,
	coords,
	sizes,
	idImage: uid,
});

module.exports = {
	path,
	resource,
	direction,
	position,
	sizes,
	actor,
}
