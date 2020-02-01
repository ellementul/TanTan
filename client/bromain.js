require("../lib/mof.js");

const Base64 = require("js-base64").Base64;

const CrInterfice = require("AsynCommun").CrCommunicator;
const CrInterWs = require("../lib/ws_client.js");

const CrSession = require("../src/session.js");
const CrKeyboard = require("./keyboard.js");
const CrDisplay = require("./display.js");

const Map_data = require("../src/map.json");

var onlyClient = false;

var url = 'ws://192.168.1.77:8081';


CrGame(onlyClient, url, Map_data);


function CrGame(onlyClient, game_url, Map_data){

	/*if(onlyClient)
		
		var Session = new CrSession(Map_data);
		
		var InterDisp = new CrInterfice();
		
		CrKeyboard(InterDisp.connect(CrDisplay()), [65, 68, 83, 87, 32]);
		InterDisp.login = "Gamer1";
		
		Session.Connect(InterDisp);
		

		InterDisp = new CrInterfice();
		
		CrKeyboard(InterDisp.connect(function(){}), [37, 38, 39, 40, 45]);
		InterDisp.login = "Gamer2";
		
		Session.Connect(InterDisp);
		
	*/
	var InterWs = CrInterWs(game_url);
	var Display =  CrDisplay();
	var Output = InterWs.connect(Display.input);
	Display.output = Output;
	CrKeyboard(Output, [65, 68, 83, 87, 37, 38, 39, 40, 32, 45]);

	
}

function Crlog(head){
	return function(str, val){
		if(val.action != "Stat") console.log(head, str, val);
	}
}
