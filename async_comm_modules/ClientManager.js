
const CrConnector = require("AsynCommun").CrConnector;

function CrManager(comm, commGamers){
	let resources = {};

	let send = comm.connect(input);
	let sendCat = msg => {msg.source = "ManGame"; msg.adr = "Catalogs"; send(msg);}

	function input(msg){
		switch(msg.action){
			case "Connected": updateResources(); break;
			case "FoundResArr": loadResource(msg); break;
			default: console.log("ManagerGamers: ", msg);
		}
	}

	function updateResources(){
		sendCat({
			action: "FindTypeAllRes",
			type: "image",
		});
	}

	function loadResource(msg){
		if(msg.success)
			resources.images = msg.resources;
	}


	return function AddClient(client){
		let sendClient = client.connect(function(){});
		sendClient({
			action: "Load",
			type: "Resources",
			resources: resources.images,
		});
		//CrConnector(client, commGamers);
	}

}

module.exports = CrManager;