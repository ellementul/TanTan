const CrRouting = require("AsynCommun").CrRouter;
const CrInter = require("AsynCommun").CrCommunicator;

const CrMap = require("./Map.js");
const CrBullets = require("./Bullets.js");
const CrBlocks = require("./Blocks.js");
const CrGamer = require("./actor_gamer.js");
const CrGameMode = require("./GameMode.js");

function CrSession(GamersData, Map_data, Destroy){
	var Param = {
		max_kills: 5
	}

	Map_data.resp = RespMap(Map_data);
	Map_data.size = Map_data.map.sizes.width;

	var ready = false;
	
	var Router = new CrRouting(true);
	var MapInter = new CrInter();
	var GameModeInter = new CrInter();
	var BulletsInter = new CrInter();
	var BlocksInter = new CrInter();

	Router(MapInter, "Default");
	Router(GameModeInter, "GameMode");
	Router(BulletsInter, "Bullets");
	Router(BlocksInter, "Blocks");

	CrMap(MapInter , Map_data);
	CrGameMode(GameModeInter, Param);
	CrBullets(BulletsInter);
	CrBlocks(BlocksInter, JSON.stringify(Map_data));
	
	var Gamers = Map_data.resp.map(function(resp, i){
		var GamerInter = new CrInter();
		Router(GamerInter, i);
		return new CrGamer(GamerInter, Ready, DestroyGamer.bind(null, i));
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

	function Ready(){
		Play_Gamers++;
		if(Play_Gamers === Len_Gamers)
			Ready_Gamers.forEach(function(Gamer){Gamer.Resp()});
	}
	
	function DestroyGamer(index){
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
