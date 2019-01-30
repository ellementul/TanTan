require("./mof.js");
require("./http.js");

const CrInterfice = require("./inter.js");
const CrInterWs = require("./ws_server.js");

const CrSession = require("./session.js");

const Map_data = require("./map.json");

var Session = new CrSession(Map_data, DestroySession);

var Ws = CrInterWs(Session.Connect);


function DestroySession(){
	Session = new CrSession(Map_data, DestroySession);
	Ws.Connect(Session.Connect);
}
