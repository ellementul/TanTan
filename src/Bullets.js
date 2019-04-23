var types = require("./Types.js");

function CrBullets(InterMap){
	var Actor = {
		bullets: Array.create(),
		is_recharge: [],
		adress: "Bullets"
	};
	
	var Output = InterMap.connect(Input);
	
	setInterval(function(){
		Actor.bullets.forEach(MoveBullet);
	}, 100);
	
	function CrBullet(mess){
		if(Actor.is_recharge[mess.source]) return;
		
		var bull = {
			source: mess.source,
			box: {w: 0.3, h: 0.3},
			dir: mess.dir,
			speed: 0.75,
			recharge: 0.5
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
			sprite: "bullet",
			source: Actor.adress,
			id: bull.id,
			dir: bull.dir,
			box: Object.assign({}, bull.box),
			pos: {x: +bull.pos.x.toFixed(2), y: +bull.pos.y.toFixed(2)}
		}
		
		Output(new_mess);
		Actor.is_recharge[mess.source] = true;
		setTimeout((
			function(id){this[id] = false}
		).bind(Actor.is_recharge, mess.source), 1000*bull.recharge);
	}
	
	function DellBull(mess){
		Output({action: "Dell", type: "Bullet", id: mess.id, type: "Bullet"});
		Actor.bullets.dell(mess.id);
	}
	
	function MoveBullet(bull){
		if(!bull) return;
		
		var axis = 'x';
		var add_axis = 'w';
		var dir = 1;
		switch(bull.dir){
			case -0.5: dir = -1;
			case 0.5: axis = "y"; add_axis = 'h'; break;
			case 1:
			case -1: dir = -1; break;
		}
		
		bull.pos[axis] += dir * bull.speed;
		
		var mess = {
			action: "Move",
			type: "Bullet",
			source: Actor.adress,
			id: bull.id,
			box: Object.assign({}, bull.box),
			pos: {x: +bull.pos.x.toFixed(2), y: +bull.pos.y.toFixed(2)},
			dir: bull.dir
		};
		
		Output(mess);
	}
	
	function Collision(mess){
		var bullet = Actor.bullets[mess.id];
		DellBull({id: mess.id});
		
		Output({
			action: "Damage",
			type: mess.list[0].type,
			adr: mess.list[0].source,
			killer: bullet.source
		});
	}
	
	function Input(mess){
		switch(mess.action){
			case "Fire": CrBullet(mess); break;
			case "OverMap": DellBull(mess); break;
			case "Collision": Collision(mess); break;
		}
	}
	
	
}

module.exports = CrBullets;
