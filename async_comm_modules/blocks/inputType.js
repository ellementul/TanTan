const T = require("typesjs");

const success = T.Bool.Def();

const source = T.Any.Def(T.Key.Def());

const uid = T.String.Def('\\w\\d-', 36);

const id = T.Any.Def(uid, T.Key.Def());

const type = T.Key.Def();

const path = T.Array.Def(T.String.Def('\\w\\d_.', 256), 256);

const fullPath = T.Any.Def(T.Const.Def(null), path);

const resources = T.Array.Def(T.Object.Def({
	id,
	type,
	path,
}), 64, false);

let switchKey = "action";
//Types of Messeges
let Types = [{
	action: "AddedResArr",
	success,
	addedIds: T.Array.Def(T.Object.Def({ oldId: id, newId: uid }), 64, true),
	adr: source
},{
	action: "AddedType",
	success,
	type: type,
	adr: source
},{
	action: "Connected",
	adress: T.Key.Def(),
}];

module.exports = T.Switch.Def(switchKey, Types);