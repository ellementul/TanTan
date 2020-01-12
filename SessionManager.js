const process = require('process');

const CrCommun = require("AsynCommun").CrCommunicator;
const CrSession = require("./async_comm_modules/Session.js");

const WsTypes = require("./src/WsTypes.js");
const CrCommWs = require("./lib/ws_server.js");

const config = require("./config.json");

const sessionComm = new CrCommun();
sessionComm.connect(MsgInput);

const Session = new CrSession(sessionComm, config);
CrCommWs(Session.addClient, WsTypes[1], WsTypes[0]);






function MsgInput(msg){
	if(msg.action == "Destroy")
		process.exit(0);
}