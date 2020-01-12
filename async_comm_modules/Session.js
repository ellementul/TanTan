const CrRouting = require("AsynCommun").CrRouter;
const CrCommun = require("AsynCommun").CrCommunicator;
const CrMultiCommun = require("AsynCommun").CrMultiCommun;

const CrResources = require("rescat.js");
const CrBlocks = require("./Blocks.js");
const CrClientManager = require("./ClientManager.js");

const moduleName = "Session";

let backgroundId = "Background";

function CrSession(CommSessions, configPaths){  

	const sendSessions = CommSessions.connect(MsgInputFromSessions);

	let Router = new CrRouting();

	let SelfComm = new CrCommun();
	const sendRouter = SelfComm.connect(MsgInputFromRouter);

	let CatalogsComm = new CrCommun();
	CrResources(CatalogsComm);

	let BlocksComm = new CrCommun();
	CrBlocks(BlocksComm, configPaths.blocks);
	
	Router(CatalogsComm, "Catalogs");
	Router(BlocksComm, "Blocks");
	Router(SelfComm, moduleName);



	this.addClient = CrClientManager(Router);


	function MsgInputFromSessions(msg){
		console.log(msg);
	}

	function MsgInputFromRouter(msg){
		switch(msg.action){
			case "Connect": InitSession(); break;
			default: console.log(msg);
		}
	}

	

	function InitSession(){
		sendRouter({
			action: "AddType",
			type: "images",
			path: configPaths.imagesDir,
			source: moduleName,
			adr: "Catalogs",
		});

		sendRouter({
			action: "AddRes",
			resource: {
				id: backgroundId,
				type: "images",
				path: configPaths.background,
			},
			source: moduleName,
			adr: "Catalogs",
		});
	}

	function DestroySession(){
		sendSessions({
			action: "Destroy"
		});
	}
}

module.exports = CrSession;