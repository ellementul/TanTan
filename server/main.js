require("../lib/mof.js");
require("./http.js");


const CrInterWs = require("../lib/ws_server.js");

const CrSession = require("../src/session.js");

const Map_data = require("../src/map.json");

var Session = new CrSession(Map_data, DestroySession);

var Ws = CrInterWs(Session.Connect);


function DestroySession(){
	Session = new CrSession(Map_data, DestroySession);
	Ws.Connect(Session.Connect);
}
