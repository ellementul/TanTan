require("../lib/mof.js");
require("./http.js");

const WsTypes = require("../src/WsTypes.js");

const CrInterWs = require("../lib/ws_server.js");

const CrSession = require("../src/session.js");

const Map_data = require("../src/map.json");

var GamersData = require("../src/gamers.json");

var Session = new CrSession(GamersData, Map_data, DestroySession);

var Ws = CrInterWs(Session.Connect, WsTypes[0], WsTypes[1]);


function DestroySession(){
	Session = new CrSession(Map_data, DestroySession);
	Ws.Connect(Session.Connect);
}
