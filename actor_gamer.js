function CrGamer(InterDisplay, InterMap){
	var bul_adr = "Bullets";
	var Gamer = {
		online: false,
		dir: 1,
		speed: 0.15,
		box: {w: 0.9, h: 0.9},
		beg_life: 3
	};
	CrDir(Gamer);
	
	var OutputDisp = InterDisplay.connect(InputDisp);
	var OutputMap = InterMap.connect(InputMap);
	this.OffGamer = Off;
	this.RespGamer = Resp;
	
		
	
	
	Gamer.scan = function(){
		OutputDisp({action: "Stat", data: {life: this.life}});
		
		if(Gamer.life <= 0){
			Off();
			Resp();
		}
		
		if(this.new_dir !== null){
			
			var dist = 0;
			if(!this.updateDir()) dist += this.speed;
			
			var mess = {
				action: "Move",
				type: "Gamer",
				id: this.id,
				dir: this.dir,
				dist: dist
			};
			
			OutputMap(mess);
		}
		
		if(this.press_fire) Gamer.fire();
	}
	
	Gamer.fire = function(){
			var axis = 'x';
			if(this.dir % 2) axis = 'y';
			var dir = 1;
			if(this.dir > 1) dir = -1;
			
			var b_pos = {x: this.pos.x, y: this.pos.y};
			b_pos[axis] += dir * (this.box.h + 0.05);
			
			var mess = {
				action: "Fire",
				source: this.adress,
				pos: b_pos,
				dir: this.dir,
				adr: bul_adr
			};
			
			this.press_fire = false;
			
			OutputMap(mess);	
	}
	
	Gamer.init = function(mess){
		this.pos = {x: mess.pos.x, y: mess.pos.y};
		this.id = mess.id;
		this.dir = mess.dir;
		this.life = this.beg_life;
		
		this.timer = setInterval(Gamer.scan.bind(Gamer), 40);
	}
	
	Gamer.update = function(mess){
		this.pos = {x: mess.pos.x, y: mess.pos.y};
		this.dir = mess.dir;
	}
	
	function Resp(){
		OutputMap({
			action: "Create",
			type: "Gamer",
			source: Gamer.adress,
			box: {w: Gamer.box.w, h: Gamer.box.h},
			sprite: "tank"
		});
	}
	
	function Off(){
		 clearInterval(Gamer.timer);
		 
		 OutputMap({
			action: "Dell",
			type: "Gamer",
			id: Gamer.id,
			source: Gamer.adress,
		});
	}
	
	function InputDisp(mess){
		switch(mess.action){
			case "Move": Gamer.new_dir = mess.dir; break;
			case "Fire": Gamer.press_fire = true; break;
		}
	}
	
	function InputMap(mess){
		if(mess.action == 'Connect'){
			Gamer.adress = mess.adr;
			return;
		}
		if(mess.type == "Map"){
			switch(mess.action){
				case "Create": Gamer.online = true; break;
				case "Dell": Gamer.online = false; break;
			}
		}
		
		if(mess.type == 'Gamer' && mess.source == Gamer.adress){
			switch(mess.action){
				case "Create": Gamer.init(mess); break;
				case "Update": Gamer.update(mess); break;
				case "Damage": Gamer.life--; return; break;
			}
		}
		
		if(Gamer.online) OutputDisp(mess);
	}
	
	function CrDir(obj){
		var dir = null;
		obj.addGetSet('new_dir', 
			function(){return dir},
			function(new_dir){
				if(dir === null){
					dir = new_dir;
				}
			}
		);
		obj.updateDir = function(){
			if(obj.dir !== dir){
				
				obj.dir = dir; 
				dir = null;
				return true;
				
			}
			dir = null;
			return false;
		};
	}
}

//Modules

if(typeof module === "object") module.exports = CrGamer;
