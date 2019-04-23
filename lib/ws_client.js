const CrInterfice = require("AsynCommun").CrCommunicator;

function CrInterWs(url, oneValidFunc, twoValidFunc){

	var socket = new WebSocket(url);
	var InterWs = new CrInterfice(oneValidFunc, twoValidFunc);

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
