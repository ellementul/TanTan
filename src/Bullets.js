var types = require("./Types.js");

var bullets_data = require("./bullet.json");

function CrBullets(Commun){
	var Actor = {
		bullets: Array.create(),
		adress: "Bullets"
	};
	
	var Output = Commun.connect(Input);

	Output({
		action: "Add",
		type: "Tiles",
		tile_type: "Bullet",
		tile: bullets_data.Bullet.tile,
		source: Actor.adress
	});
	
	function CrBullet(mess){	
		
		var bull = {
			source: mess.source,
			box: {w: 0.3, h: 0.3},
			dir: mess.dir,
			speed: 17
		};

		var axis = 'x';
		var add_axis = 'w';
		var dir = 1;
		switch(bull.dir){
			case -0.5: dir = -1;
			case 0.5: axis = "y"; add_axis = 'h'; break;
			case 1:
			case -1: dir = -1; break;
		}
		
		mess.pos[axis] += dir * bull.box[add_axis];
		
		bull.pos = {x: +mess.pos.x.toFixed(2), y: +mess.pos.y.toFixed(2)};
		
		if(types.position.test(bull.pos))
			return;

		bull.id = Actor.bullets.add(bull);
		
		var new_mess = {
			action: "Create",
			type: "Bullet",
			bull: {
				id: bull.id,
				source: Actor.adress,
				sprite: Actor.tile_id,
				dir: bull.dir,
				box: Object.assign({}, bull.box),
				pos: {x: +bull.pos.x.toFixed(2), y: +bull.pos.y.toFixed(2)},
				speed: bull.speed
			}
		}
		
		Output(new_mess);
	}
	
	function DellBull(mess){
		Output({action: "Dell", type: "Bullet", id: mess.id});
		Actor.bullets.dell(mess.id);
	}
	
	function Collision(mess){
		var bullet = Actor.bullets[mess.id];
		DellBull({id: mess.id});
		
		Output({
			action: "Damage",
			type: mess.list[0].type,
			id: mess.list[0].id,
			adr: mess.list[0].source,
			killer: bullet.source
		});
	}


	
	function Input(mess){
		switch(mess.type){
			case "Tiles": 
				switch(mess.action){
					case "Add": Actor.tile_id = mess.tile_id; break;
				} break;
		}
		switch(mess.action){
			case "Fire": CrBullet(mess); break;
			case "Collision": Collision(mess); break;
			case "OverMap":
			case "Damage": DellBull(mess); break;
		}
	}
	
	
}

module.exports = CrBullets;
