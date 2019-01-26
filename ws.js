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
			if(Ws.readyState == 1) Ws.send(JSON.stringify(mess)); else console.error(new Error("WebSocket is not open!"));
		});
		
		Ws.on('message', function(mess){
			InFunc(JSON.parse(mess));
		});
		
		Ws.on('close', function(mess){
			FuncClose(this);
		});
	}
}
