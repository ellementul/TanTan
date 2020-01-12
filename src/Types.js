
var T = require("typesjs");

var map_size = 25;
exports.map_size = map_size;
exports.obj_id = T.Index.Def(map_size*map_size*2);

exports.box = T.Object.Def({
	w: T.Number.Def(map_size, 0, 2), 
	h: T.Number.Def(map_size, 0, 2)
});

exports.position = T.Object.Def({
	x: T.Number.Def(map_size, 0, 2), 
	y: T.Number.Def(map_size, 0, 2)
});

exports.direction = T.Number.Def(1, -1, 1);

exports.path = T.Array.Def(T.String.Def('\\w\\d_.', 256), 256);
