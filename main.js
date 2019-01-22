require("./mof.js");
require("./http.js");



var Map_data = {
		resp: [{pos: {x: 1, y: 1}, dir: 1}, {pos: {x: 15, y: 15}, dir: 3}],
		size: 16,
		data: [{
				id: 0,
				sprite: "block",
				pos: {x: 8, y: 5},
				box: {w: 0.5, h: 0.5}
		},{
				id: 1,
				sprite: "block",
				pos: {x: 5, y: 5},
				box: {w: 0.5, h: 0.5}
		}]
};
const CrInterfice = require("./inter.js");
const CrRouting = require("./filter.js");
const CrMap = require("./map.js");
const CrGamer = require("./actor_gamer.js");

var InterMap = new CrRouting([
	 console.log.bind(null, "InputMap: "),
	console.log.bind(null, "OutputMap: ")
]);
CrMap(InterMap, Map_data);

var OfflineGamer = [];
var OnlineGamer = [];
Map_data.resp.forEach(function(){
	var InterWs = new CrInterfice(console.log.bind(null, "Serv-WS: "));
	
	var Gamer = new CrGamer(InterWs, InterMap);
	
	OfflineGamer.push({gamer: Gamer, inter: InterWs});
});

const CrWS = require('./ws.js');
CrWS(ConnectGamer, DisconnectGamer);

function ConnectGamer(Ws){
	if(OfflineGamer.length == 0) return;
	
	var Tmp = OfflineGamer.pop();
	var Gamer = Tmp.gamer;
	
	Ws.connectInter(Tmp.inter);
	Gamer.RespGamer();
	
	Ws.gamer_id = OnlineGamer.add(Tmp);
}

function DisconnectGamer(Ws){
	console.log(Ws.gamer_id);
	var Tmp = OnlineGamer[Ws.gamer_id];
	
	Tmp.gamer.OffGamer();
	Tmp.inter.connect(console.error);
	
	OnlineGamer.dell(Ws.gamer_id);
	OfflineGamer.push(Tmp);
	
	console.log("Dicconnect!");
}






