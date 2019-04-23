require("typesjs");
var T = Object.types;

var map_size = 20;
exports.map_size = map_size;
exports.obj_id = T.pos(map_size*map_size*2);

exports.box = {
	w: T.num(0, map_size, 2), 
	h: T.num(0, map_size, 2)
};

exports.position = T.obj({
	x: T.num(0, map_size, 2), 
	y: T.num(0, map_size, 2)
});

exports.direction = T.pos(4);