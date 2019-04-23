function CrMap(Rout, map){
	
	var List = {
		Gamer: Array.create()
	};
	CrMovingLoop(List.Gamer, Move);
	
	var Output = Rout.connect(Input);
	
	function Input(mess){
		switch(mess.action){
			case "Create": CrObj(mess); break;
			case "Move": MoveElem(mess); break;
			case "Dell": DellObj(mess); break;
		}
	}
	
	function CrObj(mess){
		
		if(mess.type == "Bullet"){
			CrBullet(mess);
			return;
		}
		
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
			type: obj.type,
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
		
		sendAllGamers(mess);
		if(mess.type == "Gamer") DellGamer(mess);
		List[mess.type].dell(mess.id);
	}

//==============GAMERS================
	
	function sendAllGamers(new_mess){
		List["Gamer"].forEach(function(gamer){
			if(gamer){
				new_mess.adr = gamer.source;
				Output(Object.assign({}, new_mess));
			}
		});
	}
	
	function CrGamer(mess, gamer){
		loadMap(gamer.id, gamer.source);
		
		var resp = map.resp[gamer.id];
		gamer.pos = {x: +resp.pos.x.toFixed(2), y: +resp.pos.y.toFixed(2)};
		gamer.dir = resp.dir;
		gamer.sprite += mess.id;
		
		
		mess.pos = gamer.pos;
		mess.dir = gamer.dir;
		mess.sprite = gamer.sprite;
		mess.source = gamer.source;
		
		return mess;
	}
	
	function DellGamer(mess){
		Output({action: "Dell", type: "Map", adr: mess.source});
	}
	
	function loadMap(id, adr){
		var Gamers = List["Gamer"].concat();
		Gamers[id] = null;
		
		Output({action: "Create", type: "Map", size: map.size, adr: adr});
		loadObjs(Gamers, adr);
	}
	
	function loadObjs(Objs, adr){
		Objs.forEach(function(obj){
			if(obj) Output({
				action: "Create",
				type: obj.type,
				id: obj.id,
				box: obj.box,
				pos: {x: +obj.pos.x.toFixed(2), y: +obj.pos.y.toFixed(2)},
				dir: obj.dir,
				sprite: obj.sprite,
				source: obj.source,
				adr: adr
			});
		});
	}
	

	function MoveElem(mess){
		
		if(mess.type == "Bullet"){
			MoveBullet(mess);
			return;
		}
		
		var obj = List[mess.type][mess.id];
		
		obj.dir = mess.dir;
		obj.speed = mess.speed;
		
		var new_mess = {
			action: "Update",
			type: obj.type,
			id: obj.id,
			pos: {x: +obj.pos.x.toFixed(2), y: +obj.pos.y.toFixed(2)},
			dir: obj.dir,
			source: obj.source
		};
		
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
					type: obj.type,
					id: obj.id,
					pos: {x: +obj.pos.x.toFixed(2), y: +obj.pos.y.toFixed(2)},
					dir: obj.dir,
					source: obj.source
				};
				
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
		List["Bullet"][mess.id] = true;
		sendAllGamers(mess);
	}
	
	function MoveBullet(mess){
		if(!List[mess.type][mess.id]) return;
		
		if(isIntoMap(mess, mess.pos)){
			mess.action = "Update";
			
			if(collisBulletGamers(mess)){
				List[mess.type][mess.id] = false;
			}else sendAllGamers(mess);
		}else{
			mess.action = "OverMap";
			mess.adr = mess.source;
			
			Output(mess);
			List[mess.type][mess.id] = false;
		}
	}
	
	function collisBulletGamers(bullet){
		var list = List["Gamer"].filter(function(wall, id){
			 if(wall) return isCollis(bullet, bullet.pos, wall);
		}).map(function(obj){
				return {
					id: obj.id, 
					type: obj.type, 
					source: obj.source, 
					pos: Object.assign({}, obj.pos)
				};
		});
		
		if(list.length){
			Output({
				action: "Collision",
				id: bullet.id,
				list: list,
				adr: bullet.source
			});
		}
		return list.length;
		
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
		Move(obj);
	}), 40);
}
