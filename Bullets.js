function CrBullets(InterMap){
	var Actor = {
		bullets: []
	};
	
	var Output = InterMap.connect(Input);
	
	setInterval(function(){
		Actor.bullets.forEach(MoveBullet);
	}, 100);
	
	var sources = [];
	
	function CrBullet(mess){
		if(sources[mess.source]) return;
		
		var bull = {
			source: mess.source,
			box: {w: 0.3, h: 0.3},
			dir: mess.dir,
			speed: 0.75,
			recharge: 0.5
		};
		
		var axis = 'x';
		var add_axis = 'w';
		if(mess.dir % 2){
			axis = 'y';
			add_axis = 'h';
		}
		var dir = 1;
		if(mess.dir > 1) dir = -1;
		
		mess.pos[axis] += dir * bull.box[add_axis];
		
		bull.pos = Object.assign({}, mess.pos);
		bull.id = Actor.bullets.add(bull);
		
		var new_mess = {
			action: "Create",
			type: "Bullet",
			sprite: "bullet",
			source: Actor.adress,
			id: bull.id,
			dir: bull.dir,
			box: Object.assign({}, bull.box),
			pos: Object.assign({}, bull.pos)
		}
		
		Output(new_mess);
		sources[mess.source] = true;
		setTimeout((function(id){this[id] = false}).bind(sources, mess.source), 1000*bull.recharge);
	}
	
	function MoveBullet(bull){
		if(!bull) return;
		
		var axis = 'x';
		var add_axis = 'w';
		if(bull.dir % 2){
			axis = 'y';
			add_axis = 'h';
		}
		var dir = 1;
		if(bull.dir > 1) dir = -1;
		
		bull.pos[axis] += dir * bull.speed;
		
		var mess = {
			action: "Move",
			type: "Bullet",
			source: Actor.adress,
			id: bull.id,
			box: Object.assign({}, bull.box),
			pos: Object.assign({}, bull.pos)
		};
		
		Output(mess);
	}
	
	function DellBull(mess){
		console.log("DellBullet: " + mess);
		
		if(Actor.bullets[mess.id]){
			Output({action: "Dell", id: mess.id, type: "Bullet"});
			Actor.bullets.dell(mess.id);
		}
	}
		
	function Input(mess){
		switch(mess.action){
			case "Connect": Actor.adress = mess.adr; break;
			case "Fire": CrBullet(mess); break;
			case "OverMap": DellBull(mess); break;
		}
	}
	
	
}

//Modules

if(typeof module === "object") module.exports = CrBullets;
