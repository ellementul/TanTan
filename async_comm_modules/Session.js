const CrRouting = require("AsynCommun").CrRouter;
const CrCommun = require("AsynCommun").CrCommunicator;
const CrMultiComm = require("AsynCommun").CrMultiComm;

const CrResources = require("rescat.js");
CrResources.valid = {
	input: ValidError(CrResources.types.input.test),
	output: ValidError(CrResources.types.output.test),
};

const CrBlocks = require("./blocks/main.js");
CrBlocks.valid = {
	input: ValidError(CrBlocks.types.input.test),
	output: ValidError(CrBlocks.types.output.test),
};

const CrSpace = require("./space/main.js");
CrSpace.valid = {
	input: ValidError(CrSpace.types.input.test),
	output: ValidError(CrSpace.types.output.test),
};

const CrClientManager = require("./ClientManager.js");

const moduleName = "Session";

let backgroundId = "Background";

function CrSession(CommSessions, configPaths){  

	const sendSessions = CommSessions.connect(MsgInputFromSessions);

	let Router = new CrRouting();

	let SelfComm = new CrCommun();
	const sendRouter = SelfComm.connect(MsgInputFromRouter);

	let CatalogsComm = new CrCommun(CrResources.valid.input, CrResources.valid.output);
	CrResources(CatalogsComm);

	let BlocksComm = new CrCommun(CrBlocks.valid.input, CrBlocks.valid.output);
	CrBlocks(BlocksComm, configPaths);

	let SpaceComm = new CrCommun(CrSpace.valid.input,  CrSpace.valid.output);
	CrSpace(SpaceComm, configPaths);

	let GamersComm = new CrCommun();
	let MangerComm = new CrCommun();

	this.addClient = CrClientManager(MangerComm, CrMultiComm(GamersComm));
	
	Router(CatalogsComm, "Catalogs");
	Router(BlocksComm, "Blocks");
	Router(SpaceComm, "Space");
	Router(MangerComm, "ManGame");
	Router(GamersComm, "Gamers");
	Router(SelfComm, moduleName);



	


	function MsgInputFromSessions(msg){
		console.log(msg);
	}

	function MsgInputFromRouter(msg){
		switch(msg.action){
			case "Connected": InitSession(); break;
			default: console.log("Session: ", msg);
		}
	}

	

	function InitSession(){
		
	}

	function DestroySession(){
		sendSessions({
			action: "Destroy"
		});
	}
}

module.exports = CrSession;

function ValidError(test){

	return function(val){
		if(test(val))
			throw new Error(JSON.stringify(test(val), "", 4));

		return val;
	}
}