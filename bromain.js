require("./mof.js");
require("./types.js");
const PIXI = require("pixi.js");

const CrInterfice = require("./inter.js");
const CrInterWs = require("./ws_client.js");

const Types = require("./inter_types_client.js");

const CrSession = require("./session.js");
const CrKeyboard = require("./keyboard.js");
const CrDisplay = require("./display.js");

const Map_data = require("./map.json");

var onlyClient = false;

var url = 'ws://192.168.1.76:8081';


CrGame(onlyClient, url, Map_data);


function CrGame(onlyClient, game_url, Map_data){

	if(onlyClient){
		
		var Session = new CrSession(Map_data);
		
		var InterDisp = new CrInterfice(Types, Crlog("Gamer1"));
		InterDisp.test();
		CrKeyboard(InterDisp.connect(CrDisplay()), [65, 68, 83, 87, 32]);
		InterDisp.login = "Gamer1";
		
		Session.Connect(InterDisp);
		

		InterDisp = new CrInterfice(Types, Crlog("Gamer2"));
		InterDisp.test();
		CrKeyboard(InterDisp.connect(function(){}), [37, 38, 39, 40, 45]);
		InterDisp.login = "Gamer2";
		
		Session.Connect(InterDisp);
		
	}else{
		var InterWs = CrInterWs(game_url);
		
		InterWs.test(Types, Crlog("Client"));
		CrKeyboard(InterWs.connect(CrDisplay()), [65, 68, 83, 87, 37, 38, 39, 40, 32, 45]);
	}

	
}

function Crlog(head){
	return function(str, val){
		if(val.action != "Stat") console.log(head, str, val);
	}
}
