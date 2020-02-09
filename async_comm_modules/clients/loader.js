const CrConnector = require("AsynCommun").CrConnector;

function CrLoader(commGamers){



	this.addClient = function(client, tmpComm){
		let protoSendClient = client.connect(inputClient);
		let send = tmpComm.connect(sendClient);
		send.cat = msg => {msg.adr = "Catalogs"; msg.source = tmpComm.adress; send(msg);}
		send.space = msg => {msg.adr = "Space"; msg.source = tmpComm.adress; send(msg);}

		send.cat({
			action: "FindTypeAllRes",
			type: "image",
		});

		send.space({
			action: "Load",
			type: "World",
		});

		function inputClient(msg){
			console.log(msg);
		}

		function sendClient(msg){
			if(msg.action == "Connected")
				return;

			if(msg.action == "FoundResArr"){
				msg.action = "Load";
				msg.type = "Resources";
			}
			

			protoSendClient(msg);
		}

		function loadEnd(){
			CrConnector(client, commGamers);
		}

	};

	
}
module.exports = CrLoader;