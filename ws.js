module.exports = function CrWs(FuncOpen, FuncClose){
	const WebSocket = require('ws');
	const Wss = new WebSocket.Server({ port: 8081 });

	Wss.on('connection', function connection(Ws) {
		
		Ws.connectInter = ConnectWs;
		FuncOpen(Ws);
	});
	
	
	
	function ConnectWs(Inter){
		var Ws = this;
		var InFunc = Inter.connect(function(mess){
			Ws.send(JSON.stringify(mess));
		});
		
		Ws.on('message', function(mess){
			InFunc(JSON.parse(mess));
		});
		
		Ws.on('close', function(mess){
			FuncClose(this);
		});
	}
}
