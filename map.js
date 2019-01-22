function CrMap(Rout, map){
	
	var obj_arr = map.data;
	var gamers = [];
	
	var Output = Rout.connRecip(Input);
	
	function Input(mess){
		if(mess.action == "Create"){
			CrObj(mess);
		}
		if(mess.action == "Move"){
			MoveElem(mess);
		}
		if(mess.action == "Dell"){
			DellObj(mess);
		} 
	}
	
	function CrObj(mess){
		
		var obj = {
			source: mess.source,
			sprite: mess.sprite,
			box: mess.box
		};
		
		var id = obj_arr.add(obj);
		mess.id = id;
		obj.id = id;
		
		if(mess.type == "Gamer"){
			mess = CrGamer(mess, obj);
		}
		
		gamers.forEach(function(id){
			mess.adr = obj_arr[id].source;
			Output(Object.assign({}, mess));
		});
	}
	
	function DellObj(mess){
		
		if(mess.type == "Gamer"){
			DellGamer(mess);
		}
		
		var new_mess = {
			action: "Dell",
			type: "Elem",
			id: mess.id
		};
		
		gamers.forEach(function(id){
			if(obj_arr[id]){
				new_mess.adr = obj_arr[id].source;
				Output(Object.assign({}, new_mess));
			}
		});
		
		obj_arr.dell(mess.id);
	}
	
	function CrGamer(mess, obj){
		var n = gamers.add(mess.id);
		var resp = map.resp[n];
		obj.pos = {x: resp.pos.x, y: resp.pos.y};
		obj.dir = resp.dir;
		
		mess.sprite += n;
		obj.sprite = mess.sprite;
		
		mess.pos = obj.pos;
		mess.dir = obj.dir;
		mess.adr = obj.source;
		
		var data = obj_arr.concat();
		data[mess.id] = null;
		Output({action: "Create", type: "Map", data: data, size: map.size, adr: obj.source});
		
		
		
		return mess;
	}

	function MoveElem(mess){
		var obj = obj_arr[mess.id];
		
		obj.dir = mess.dir;
		
		var axis = 'x';
		if(mess.dir % 2) axis = 'y';
		var dir = 1;
		if(mess.dir > 1) dir = -1;
		
		
		var new_pos = {x: obj.pos.x, y: obj.pos.y};
		new_pos[axis] += dir * mess.dist;
		
		if(isMove(obj, new_pos)) obj.pos = new_pos;
		
		var new_mess = {
			action: "Update",
			type: "Elem",
			id: mess.id,
			pos: {x: obj.pos.x, y: obj.pos.y},
			dir: obj.dir
		};
		
		gamers.forEach(function(id){
			new_mess.adr = obj_arr[id].source;
			Output(Object.assign({}, new_mess));
		});
		
	}
	
	
	function DellGamer(mess){
		gamers.dell(gamers.indexOf(mess.id));
	}
	
	function isMove(obj, new_pos){
		var w = 'w';
		var h = 'h';
		
		if(obj.dir % 2){
			w = 'h';
			h = 'w';
		}
		
		return (new_pos.x - obj.box[w]) > 0 
		&& (new_pos.x + obj.box[w]) < map.size
		&& (new_pos.y - obj.box[h]) > 0 
		&& (new_pos.y + obj.box[h]) < map.size
		&& !obj_arr.some(function(wall, id){
			if(wall.id !== obj.id) return isCollig(obj, new_pos, wall);
		});
	}
	
	function isCollig(obj, new_pos, wall){
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

//Modules

if(typeof module === "object") module.exports = CrMap;

// Вынести массовую расслку в отдельную функцию!
