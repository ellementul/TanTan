const CrInterfice = require("AsynCommun").CrCommunicator;

function CrInterWs(url){

	var socket = new WebSocket(url);
	var InterWs = new CrInterfice();

	socket.addEventListener('open', function (event) {
		var InFunc = InterWs.connect(function(mess){
			socket.send(JSON.stringify(mess));
		});
		
		socket.addEventListener('message', function (event) {
			InFunc(JSON.parse(event.data));
		});
	});
	
	return InterWs;
}

module.exports = CrInterWs;
