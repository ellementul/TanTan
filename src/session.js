const CrRouting = require("AsynCommun").CrRouter;
const CrCommun = require("AsynCommun").CrCommunicator;

const CrResources = require("./Resources.js");
const CrMap = require("./Map.js");
const CrBullets = require("./Bullets.js");
const CrBlocks = require("./Blocks.js");
const CrGamer = require("./actor_gamer.js");
const CrGameMode = require("./GameMode.js");

function CrSession(GamersData, Map_data, Destroy){
	var Param = {
		max_kills: 5
	}

//====================InitSession========================

	Map_data.resp = RespMap(Map_data);
	Map_data.size = Map_data.map.sizes.width;

	var ready = false;
	
	var Router = new CrRouting(true);
	var MapCommun = new CrCommun();
	var GameModeCommun = new CrCommun();
	var BulletsCommun = new CrCommun();
	var BlocksCommun = new CrCommun();
	var ResourcesCommun = new CrCommun();
	var PlayersManagerCommun = new CrCommun();

	Router(MapCommun, "Default");
	Router(GameModeCommun, "GameMode");
	Router(BulletsCommun, "Bullets");
	Router(BlocksCommun, "Blocks");
	Router(PlayersManagerCommun, "PlayersManager");

	CrMap(MapCommun, Map_data);
	CrGameMode(GameModeCommun, Param);
	CrBullets(BulletsCommun);
	CrBlocks(BlocksCommun, JSON.stringify(Map_data));
	
//====================PlayersManager===============================

	var Send = PlayersManagerCommun.connect(Input);

	var Gamers = Map_data.resp.map(function(resp, i){
		var GamerCommun = new CrCommun();
		Router(GamerCommun, i);
		return new CrGamer(GamerCommun);
	});
	
	var Len_Gamers = Gamers.length;
	var Ready_Gamers = 0;
	var Play_Gamers = 0;

	this.Connect = function(Client){

		Client.data = GamersData[Client.login];
		
		if(Len_Gamers !== Ready_Gamers){
			Gamers[Ready_Gamers].Connect(Client);
			Ready_Gamers++;
		}
		else 
			Client.disconnect({action: "Stat", data: {Status: "Max gamers on map!"}});
	}

	function Input(mess){
		switch(mess.action){
			case "Connect": break;
			case "ReadyLoad": Ready(mess); break;
			default: throw new Error(JSON.stringify(mess), "", 4);
		}
	}

	function Ready(){
		Play_Gamers++;
		if(Play_Gamers === Len_Gamers)
			Gamers.forEach(function(Gamer){Gamer.Ready()});
	}
	
	function DestroyGamer(index){
		Ready_Gamers[index].Destroy();
		delete Ready_Gamers[index];
		if(ready && Ready_Gamers.every(function(gamer){return !gamer;})) Destroy();
	}
	
}

function RespMap(map_data){
	return map_data.tiles.filter(
		(tile)=> (tile.type == "spawner")
	).map(GetTileCoords).filter((resp)=> resp.length)


	function GetTileCoords(tile){
		var layers = map_data.map.layers;
		var blocks = [];

		layers.forEach((layer)=>
			layer.forEach(function(block){
				if(tile.id == block.tile_id)
					blocks.push(block.coords)
			})
		);

		return blocks;
	}
}



module.exports = CrSession;
