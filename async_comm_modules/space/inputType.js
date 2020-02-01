const T = require("typesjs");

const success = T.Bool.Def();

const source = T.Any.Def(T.Key.Def());

const uid = T.String.Def('\\w\\d-', 36);

const id = T.Any.Def(uid, T.Key.Def());

const type = T.Key.Def();

let switchKey = "action";

//Types of Messeges
let Types = [{
	action: "Connected",
	adress: T.Key.Def(),
}];

module.exports = T.Switch.Def(switchKey, Types);