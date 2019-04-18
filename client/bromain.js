require("../lib/mof.js");
require("typesjs");
const PIXI = require("pixi.js");

const CrInterfice = require("AsynCommun").CrCommunicator;
const CrInterWs = require("../lib/ws_client.js");

const Types = require("./inter_types_client.js");

const CrSession = require("../src/session.js");
const CrKeyboard = require("./keyboard.js");
const CrDisplay = require("./display.js");

const Map_data = require("../src/map.json");

var onlyClient = false;

var url = 'ws://192.168.0.7:8081';


CrGame(onlyClient, url, Map_data);


function CrGame(onlyClient, game_url, Map_data){

	if(onlyClient){
		
		var Session = new CrSession(Map_data);
		
		var InterDisp = new CrInterfice();
		
		CrKeyboard(InterDisp.connect(CrDisplay()), [65, 68, 83, 87, 32]);
		InterDisp.login = "Gamer1";
		
		Session.Connect(InterDisp);
		

		InterDisp = new CrInterfice();
		
		CrKeyboard(InterDisp.connect(function(){}), [37, 38, 39, 40, 45]);
		InterDisp.login = "Gamer2";
		
		Session.Connect(InterDisp);
		
	}else{
		var InterWs = CrInterWs(game_url);
		CrKeyboard(InterWs.connect(CrDisplay()), [65, 68, 83, 87, 37, 38, 39, 40, 32, 45]);
	}

	
}

function Crlog(head){
	return function(str, val){
		if(val.action != "Stat") console.log(head, str, val);
	}
}
