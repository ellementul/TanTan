const CrRouting = require("AsynCommun").CrRouter;
const CrInter = require("AsynCommun").CrCommunicator;

const CrMap = require("./Map.js");
const CrBullets = require("./Bullets.js");
const CrGamer = require("./actor_gamer.js");
const CrGameMode = require("./GameMode.js");

function CrSession(Map_data, Destroy){
	var Param = {
		max_kills: 5
	}
	
	var ready = false;
	
	var Router = new CrRouting(true);
	var MapInter = new CrInter();
	var GameModeInter = new CrInter();
	var BulletsInter = new CrInter();

	Router(MapInter, "Default");
	Router(GameModeInter, "GameMode");
	Router(BulletsInter, "Bullets");

	CrMap(MapInter , Map_data);
	CrGameMode(GameModeInter, Param);
	CrBullets(BulletsInter);
	
	var Gamers = Map_data.resp.map(function(resp, i){
		var GamerInter = new CrInter();
		Router(GamerInter, i);
		return new CrGamer(GamerInter, DestroyGamer.bind(null, i));
	});
	
	var Ready_Gamers = [];
	this.Connect = function(Client){
		
		if(Gamers.length && !ready){
			Ready_Gamers[Gamers.length - 1] = (Gamers.pop()).Connect(Client);
			
			if(!Gamers.length){
				Ready_Gamers.forEach(function(Gamer){Gamer.Resp()});
				ready = true;
			}
		}else Client.disconnect({action: "Stat", data: {Status: "Max gamers on map!"}});
	}
	
	function DestroyGamer(index){
		delete Ready_Gamers[index];
		if(ready && Ready_Gamers.every(function(gamer){return !gamer;})) Destroy();
	}
	
}

module.exports = CrSession;
