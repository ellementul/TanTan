const Path = require("path");

function CrBlocks(Rout, confPaths){

	let send = Rout.connect(Input);

	

	let blocks = [];

	let tileFile = require(Path.resolve( ...confPaths.blocks, "tileset.json"));
	let images = tileFile.images;
	let tiles = tileFile.tiles;

	let imageArr = images.map((tile, index) => {return {id: "" + index, type: "image", path: tile.path}});

	let protoBlocks = require(Path.resolve( ...confPaths.blocks, "map.json")).blocks;




	function init(adr){
		send.setReturn = msg => {msg.source = adr; return msg;}
		send.cat = msg => {msg.adr = "Catalogs"; send(msg);}
		send.world = msg => {msg.adr = "Space"; send(msg);}

		send.cat(send.setReturn({
			action: "AddType",
			type: "image",
			path: confPaths.imagesDir,
		}));
		send.cat(send.setReturn({
			action: "AddResArr",
			type: "image",
			resources: imageArr,
		}));

		protoBlocks.forEach(protoBlock =>{
			send.world(send.setReturn({}));
		});
	}

	function AddedTiles(msg){
		msg.addedIds.forEach(ids => tiles[+ids.oldId].id = ids.newId);
	}

	function Input(msg){
		switch(msg.action){
			case "Connected": init(msg.adress); break;
			case "AddedType": break;
			case "AddedResArr": AddedTiles(msg); break;
			default: console.log("unknow msg in Blocks: ", msg);
		}
	}

	
}  

CrBlocks.types = {
	input: require("./inputType.js"),
	output: {test: () => false},
};

module.exports = CrBlocks;