function CrMap(Commun, map){
	var Tiles = Array.create();

	var List = {
		Gamer: Array.create(),
		Bullet: Array.create(),
		Block: Array.create()
	};

	CrMovingLoop(List.Gamer, Move);
	CrMovingLoop(List.Bullet, MoveBullet);
	
	var Output = Commun.connect(Input);
	
	function Input(mess){
		if(mess.action == 'Connect') return;

		switch(mess.type){
			case "Tiles":
				switch(mess.action){
					case "Create": LoadTiles(mess); break;
					case "Add": AddTile(mess); break;
				} 
				break;
			case "Map":
				switch(mess.action){
					case "Create": loadMap(mess); break;
				} 
				break;
			case "Bullet": 
				switch(mess.action){
					case "Create": CrBullet(mess); break;
				} 
				break;
			case "Gamer": 
				switch(mess.action){
					case "Create": CrObj(mess); break;
					case "Move": MoveElem(mess); break;
				} 
				break;
			default: console.log("Unknown message: ", mess);
		}

		switch(mess.action){
			case "Dell": DellObj(mess); break;
		}
	}
	
	
	
	

//==============TILES=================
	function AddTile(mess){
		var tile = mess.tile;
		var id = Tiles.add(tile);
		tile.id = id;

		Output({
			action: "Add",
			type: "Tiles",
			tile_type: mess.tile_type,
			tile_id: tile.id,
			adr: mess.source
		});

		sendAllGamers({
			action: "Add",
			type: "Tiles",
			tile: tile
		});
	}
	
	function LoadTiles(mess){

		Output({
			action: "Create",
			type: "Tiles",
			tiles: Tiles.concat(),
			adr: mess.source
		});
	}

//==============GAMERS================
	
	function sendAllGamers(new_mess){
		new_mess.adr = "PlayersManager";
		Output(new_mess);
	}

	function CrObj(mess){
		
		var obj = {
			type: mess.type,
			source: mess.source,
			sprite: mess.sprite,
			box: mess.box
		};

		if(mess.speed){
			obj.speed = mess.speed;
			obj.date = Date.now();
		}


		if(!List[mess.type]) List[mess.type] = Array.create();
		var id = List[mess.type].add(obj);
		obj.id = id;
		
		var new_mess = {
			action: "Create",
			type: "Actor",
			actor_type: mess.type,
			id: obj.id,
			sprite: obj.sprite,
			box: mess.box,
		};
		
		if(mess.type == "Gamer"){
			new_mess = CrGamer(new_mess, obj);
		}
		
		sendAllGamers(new_mess);
	}

	function DellObj(mess){

		var new_mess = {
			action: "Dell",
			type: "Actor", 
			actor_type: mess.type, 
			id: mess.id
		}
		
		sendAllGamers(new_mess);

		if(mess.type == "Gamer") DellGamer(mess);
		List[mess.type].dell(mess.id);
	}
	
	function CrGamer(mess, gamer){
		
		var resp = map.resp[gamer.id][0];
		
		gamer.pos = {x: +resp.x.toFixed(2), y: +resp.y.toFixed(2)};
		gamer.dir = 0; //=====================================Resp
		
		
		mess.pos = gamer.pos;
		mess.dir = gamer.dir;
		mess.sprite = gamer.sprite;
		mess.source = gamer.source;

		SendGamer(mess);
		
		return mess;
	}

	function SendGamer(mess){
		var new_mess = Object.assign({}, mess);
		new_mess.type = "Gamer";
		new_mess.adr = new_mess.source;
		Output(new_mess);
	}
	
	function DellGamer(mess){

	}
	
	function loadMap(mess){
		var Gamers = List["Gamer"].concat();
		var Blocks = List["Block"].concat();
		
		Output({
			action: "Create", 
			type: "Map", 
			size: map.size, 
			adr: mess.source
		});

		loadBlocks(Blocks, mess.source);

		loadGamers(Gamers, mess.source);
	}
	
	function loadGamers(Objs, adr){
		Objs.forEach(function(obj){
			if(obj) Output({
				action: "Create",
				type: "Actor",
				actor_type: obj.type,
				id: obj.id,
				box: obj.box,
				pos: {x: +obj.pos.x.toFixed(2), y: +obj.pos.y.toFixed(2)},
				dir: obj.dir,
				sprite: obj.sprite,
				adr: adr
			});
		});
	}

	function loadBlocks(Blocks, adr){
		Blocks.forEach(function(obj){
			if(obj) Output({
				action: "Create",
				type: obj.type,
				id: obj.id,
				box: obj.box,
				pos: {x: +obj.pos.x.toFixed(2), y: +obj.pos.y.toFixed(2)},
				dir: obj.dir,
				sprite: obj.sprite,
				adr: adr
			});
		});
	}
	

	function MoveElem(mess){
		
		if(mess.type == "Bullet"){
			throw new Error();
		}
		
		var obj = List[mess.type][mess.id];
		
		obj.dir = mess.dir;
		obj.speed = mess.speed;
		
		var new_mess = {
			action: "Update",
			type: "Actor",
			actor_type: obj.type,
			id: obj.id,
			pos: {x: +obj.pos.x.toFixed(2), y: +obj.pos.y.toFixed(2)},
			dir: obj.dir,
			source: obj.source
		};
		
		if(obj.type == "Gamer")
			SendGamer(new_mess);
		
		sendAllGamers(new_mess);
	}

	function Move(obj){
		if(obj.speed){

			var axis = 'x';
			var dir = 1;
			switch(obj.dir){
				case -0.5: dir = -1;
				case 0.5: axis = "y"; break;
				case 1:
				case -1: dir = -1; break;
			}
			
			
			var new_pos = {x: obj.pos.x, y: obj.pos.y};
			var new_date = Date.now();

			new_pos[axis] += dir * obj.speed * (new_date - obj.date) * 0.0005;
			
			
			if(isMove(obj, new_pos)){
				obj.pos = new_pos;
				
				var new_mess = {
					action: "Update",
					type: "Actor",
					actor_type: obj.type,
					id: obj.id,
					pos: {x: +obj.pos.x.toFixed(2), y: +obj.pos.y.toFixed(2)},
					dir: obj.dir
				};

				if(obj.type == "Gamer")
					SendGamer(new_mess);
				
				sendAllGamers(new_mess);
			}
		}
		obj.date = Date.now();
	}
	
	function isMove(obj, new_pos){
		
		return isIntoMap(obj, new_pos)
		&& !List["Gamer"].some(function(wall, id){
			if(wall && (wall.type !== obj.type || wall.id !== obj.id)) return isCollis(obj, new_pos, wall);
		});
	}
	
//===============Bullets================
	
	function CrBullet(mess){
		if(!List["Bullet"]) List["Bullet"] = Array.create();
		var bull = mess.bull;
		bull.date = Date.now();
		List["Bullet"][bull.id] = bull;

		var new_mess = {
			action: "Create",
			type: "Actor",
			actor_type: "Bullet",
			id: bull.id,
			sprite: bull.sprite,
			box: {w: bull.box.w, h: bull.box.h},
			pos: {x: +bull.pos.x.toFixed(2), y: +bull.pos.y.toFixed(2)},
			dir: bull.dir
		};

		sendAllGamers(new_mess);
	}
	
	function MoveBullet(bull){

		var axis = 'x';
		var dir = 1;
		switch(bull.dir){
			case -0.5: dir = -1;
			case 0.5: axis = "y"; break;
			case 1:
			case -1: dir = -1; break;
		}
		

		bull.pos[axis] += dir * bull.speed * (Date.now() - bull.date) * 0.0005;

		if(!collisBullet(bull, bull.pos))
			sendAllGamers({
				action: "Update",
				type: "Actor",
				actor_type: "Bullet",
				id: bull.id,
				box: {w: bull.box.w, h: bull.box.h},
				pos: {x: +bull.pos.x.toFixed(2), y: +bull.pos.y.toFixed(2)},
				dir: bull.dir
			});

		bull.date = Date.now();
	}

	function collisBullet(bull, new_pos){
		
		if(isIntoMap(bull, new_pos)){
			
			var objs = collisBulletObst(bull, "Gamer");
			var bulls = collisBulletObst(bull, "Bullet");
			if(objs.length || bulls.length){

				var list = objs;
				if(!objs.length)
					list = bulls;

				Output({
					action: "Collision",
					id: bull.id,
					list: list,
					adr: bull.source
				});

				List["Bullet"].dell(bull.id);
				return true;
			}
			return false;
		}else{
			Output({
				action: "OverMap",
				id: bull.id,
				adr: bull.source
			});
			List["Bullet"].dell(bull.id);
			return true;
		}
	}
	
	function collisBulletObst(bullet, obst_type){
		return List[obst_type].filter(function(obst){
			 if(obst && !(obst.id == bullet.id && obst_type == "Bullet")) 
			 	return isCollis(bullet, bullet.pos, obst);
		}).map(function(obj){
			return {
				id: obj.id, 
				type: obst_type, 
				source: obj.source, 
				pos: Object.assign({}, obj.pos)
			};
		});
	}

//===============Blocks==================

	function CrBlock(mess){
		var block = mess.block;
		var obj = {
			type: mess.type,
			pos: {x: block.coords.x, y: block.coords.y},
			box: {w: block.coords.x + block.size, h: block.coords.x + block.size},
			dir: block.rotate,
			sprite: block.images[0],
		};

		obj.id = List.Block.add(obj);

	}
	
//================================
	
	function isIntoMap(obj, new_pos){
		var w = 'w';
		var h = 'h';
		
		if(obj.dir % 2){
			w = 'h';
			h = 'w';
		}
		
		return (new_pos.x - obj.box[w]) > 0 
		&& (new_pos.x + obj.box[w]) < map.size
		&& (new_pos.y - obj.box[h]) > 0 
		&& (new_pos.y + obj.box[h]) < map.size;
	}
	
	function isCollis(obj, new_pos, wall){
		var o_w = 'w';
		var o_h = 'h';
		var w_w = 'w';
		var w_h = 'h';
		
		if(obj.dir % 2){
			o_w = 'h';
			o_h = 'w';
		}
		
		if(wall.dir % 2){
			w_w = 'h';
			w_h = 'w';
		}
		
		if((new_pos.x - obj.box[o_w]) > (wall.pos.x + wall.box[w_w])) return false;
		if((new_pos.x + obj.box[o_w]) < (wall.pos.x - wall.box[w_w])) return false;
		
		if((new_pos.y - obj.box[o_h]) > (wall.pos.y + wall.box[w_h])) return false;
		if((new_pos.y + obj.box[o_h]) < (wall.pos.y - wall.box[w_h])) return false;
		
		return true;
	}
}

module.exports = CrMap;

function CrMovingLoop(Objects, Move){
	setInterval(Objects.forEach.bind(Objects, function(obj){
		if(obj) Move(obj);
	}), 40);
}
