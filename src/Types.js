
const T = require("typesjs");

const uid = T.String.Def('\\w\\d-', 36);

const path = T.Array.Def(T.String.Def('\\w\\d_.', 256), 256);

exports.resource = T.Object.Def({ id: uid,  fullPath: path});

/*exports.box = T.Object.Def({
	w: T.Number.Def(map_size, 0, 2), 
	h: T.Number.Def(map_size, 0, 2)
});

exports.position = T.Object.Def({
	x: T.Number.Def(map_size, 0, 2), 
	y: T.Number.Def(map_size, 0, 2)
});
*/
exports.direction = T.Number.Def(1, -1, 1);

exports.path = path;
