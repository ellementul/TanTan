const Path = require("path");
const UUID = require("uuid/v5");
let namespace = require("uuid/v1")();

function CrBlocks(Rout, confPaths){

	let send = Rout.connect(Input);

	

	let blocks = new Map();

	let tileFile = require(Path.resolve( ...confPaths.blocks, "tileset.json"));
	let images = tileFile.images;
	let tiles = tileFile.tiles;

	let imageArr = images.map((tile, index) => {return {id: "" + index, type: "image", path: tile.path}});

	let protoBlocks = require(Path.resolve( ...confPaths.blocks, "map.json")).blocks;




	function init(adr){
		send.setReturn = msg => {msg.source = adr; return msg;}
		send.cat = msg => {msg.adr = "Catalogs"; send(msg);}
		send.space = msg => {msg.adr = "Space"; send(msg);}

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
	}

	function AddedTiles(msg){
		msg.addedIds.forEach(ids => tiles[+ids.oldId].id = ids.newId);

		protoBlocks.forEach((protoBlock, index) =>{
			let tile = tiles[protoBlock.tile];
			let id = UUID("" + index, namespace);

			blocks.set(id, {});

			send.space(send.setReturn({
				action: "Add",
				type: "Wall",
				id,
				coords: {x: protoBlock.pos[0], y: protoBlock.pos[1]},
				collisFig: {
					type: "Box",
					size: {w: tile.size[0], h: tile.size[1]},
				},
				idImage: tile.id,
			}));
		});
	}

	function AddedWall(msg){
		if(!msg.success)
			blocks.delete(msg.id);
	}

	function Input(msg){
		switch(msg.action){
			case "Connected": init(msg.adress); break;
			case "AddedType": break;
			case "AddedResArr": AddedTiles(msg); break;
			case "AddedWall": AddedWall(msg); break;
			default: console.log("unknow msg in Blocks: ", msg);
		}
	}

	
}  

CrBlocks.types = {
	input: require("./inputType.js"),
	output: {test: () => false},
};

module.exports = CrBlocks;