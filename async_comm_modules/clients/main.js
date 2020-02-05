
const CrCommun = require("AsynCommun").CrCommunicator;
const CrMultiComm = require("AsynCommun").CrMultiComm;

const CrLoader = require("./loader");

function CrManager(comm, Router){
	let resources = {};

	let gamersComm = new CrCommun();
	let multiComm = new CrMultiComm(gamersComm);
	Router(gamersComm, "Gamers");


	let send = comm.connect(input);
	let loader = new CrLoader(multiComm, Router);
	

	function input(msg){
		switch(msg.action){
			case "Connected": init(); break;
			default: console.log("ManagerGamers: ", msg);
		}
	}

	function init(){
	}

	let count = 0;
	function UUID(){
		return ("Gamers" + (count++));
	}


	return function AddClient(client){
		let adress = UUID();
		let commTmp = new CrCommun();
		Router(commTmp, adress);
		commTmp.adress = adress;

		loader.addClient(client, commTmp);
	}

}

module.exports = CrManager;