const CrRouting = require("./filter.js");

const CrMap = require("./Map.js");
const CrBullets = require("./Bullets.js");
const CrGamer = require("./actor_gamer.js");
const CrGameMode = require("./GameMode.js");

function CrSession(Map_data, Destroy){
	var Param = {
		max_kills: 5
	}
	
	var ready = false;
	
	var InterRout = new CrRouting([], true);
	CrMap(InterRout , Map_data);
	CrGameMode(InterRout, Param);
	CrBullets(InterRout);
	
	var Gamers = Map_data.resp.map(function(resp, i){
		return new CrGamer(InterRout, DestroyGamer.bind(null, i));
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
