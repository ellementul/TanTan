require("../lib/mof.js");
const Path = require("path");

function CrBlocks(Rout, confPath){

	let tileFilesList = require(Path.resolve( ...confPath, "tiles.json"));
	console.log(tileFilesList);
	var Data = JSON.parse(json_data_bloks);
	var sizes = Data.map.sizes;
	var Tiles = Data.tiles;

	var Blocks = Array.create();

	/*var crLine = Array.create.bind(null, null, sizes.width);
	var crPline = Array.create.bind(null, crLine, sizes.width, true);
	var map = Array.create(crPline, sizes.layers);*/

	var Send = {map: Rout.connect(Input)};

	/*Send.map({
		action: "Create",
		type: "BlockTiles",
		data: Tiles.map((tile)=> {image: tile.images[0], size: tile.size})
	});*/
	
	function Input(mess){
		switch(mess.action){
			
		}
	}

	//loadMap(Data.map.layers);

	function loadMap(layers){
		var background = layers[0];

		background.forEach(CrGroundBlocks);

		function CrGroundBlocks(block){
			block.images = Tiles[block.tile_id].images;
			Send.map({
				action: "Create",
				type: "Block",
				block: block,
				collis: 0
			});
		}
	}



	function fillBox(tile, coords, size){
		var box = {coords: coords, size: tile.size, tile_id: tile.id};
		var size = tile.size;

		for(var i = size - 1; i >= 0; i--){
			for(var j = size - 1; j >= 0; j--){
				map[coords.z][coords.y + j][coords.x + i] = box;
			}
		}

		return coords;
	}

	function clearBox(box){
		var coords = box.coords;
		var size = box.size;

		for(var i = size - 1; i >= 0; i--){
			for(var j = size - 1; j >= 0; j--){
				map[coords.z][coords.y + j][coords.x + i] = null;
			}
		}
		return coords;
	}

	function is_coords(coords, size=1){
		return coords 
		&& map[coords.z] 
		&& map[coords.z][coords.y] 
		&& map[coords.z][coords.y + size - 1]
		&& map[coords.z][coords.y][coords.x] !== undefined
		&& map[coords.z][coords.y + size - 1][coords.x + size - 1] !== undefined;
	}

	function is_empty(coords, size=1){
		for(var i = size - 1; i >= 0; i--){
			for(var j = size - 1; j >= 0; j--){
				if(map[coords.z][coords.y + j][coords.x + i] !== null)
					return false;
			}
		}
		return true;
	}
}

module.exports = CrBlocks;