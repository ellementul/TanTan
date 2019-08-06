function CrWs(FuncOpen, oneValidFunc, twoValidFunc){
	const WebSocket = require('ws');
	const CrInterfice = require("AsynCommun").CrCommunicator;
	
	const Wss = new WebSocket.Server({ port: 8081 });
	
	var cout = 0;
	Wss.on('connection', function connection(Ws) {
		
		var Inter = new CrInterfice(oneValidFunc, twoValidFunc);
		
		var InFunc = Inter.connect(function(mess){
			if(Ws.readyState == 1) Ws.send(JSON.stringify(mess));
		});
		
		Ws.on('message', function(mess){
			InFunc(JSON.parse(mess));
		});
		
		Ws.on('close', function(mess){
			if(Inter.disconnect) Inter.disconnect();
		})
		
		Inter.login = "GamerN" + (cout++);
		Inter.disconnect = function(mess){
			if(Ws.readyState == 1) Ws.send(JSON.stringify(mess));
			Ws.terminate();
		}
		
		FuncOpen(Inter);
	});
	
	return {Connect: function(func){ FuncOpen = func; }}
}
module.exports = CrWs;
