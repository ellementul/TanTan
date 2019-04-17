function CrGamer(Roter, Destroy){
	var bul_adr = "Bullets";
	var game_mod_adr = "GameMode";
	var Gamer = {
		online: false,
		dir: 1,
		speed: 0.15,
		box: {w: 0.9, h: 0.9},
		beg_life: 3,
		kills: 0,
		deaths: 0
	};
	CrDir(Gamer);
	
	var OutputClient = null;
	var Output = Roter.connect(Input);
	
	this.Connect = function(Client){
		OutputClient = Client.connect(InputClient);
		
		Gamer.login = Client.login;
		OutputClient({action: "Stat", data: {Status: "Watch other gamers", login: Gamer.login}});
		Output({action: "Reg", login: Gamer.login, source: Gamer.adress, adr: game_mod_adr});
		
		Client.disconnect = this.Disconnect;
		Gamer.online = true;
		
		return this;
	}
	this.Disconnect = function(){
		Off();
		OutputClient = null;
		Gamer.online = false;
		Destroy();
	}
	this.Off = Off;
	this.Resp = Resp;
	
		
	
	
	Gamer.scan = function(){
		
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
			
			Output(mess);
		}
		
		if(this.press_fire) Gamer.fire();
	}
	
	Gamer.upStat = function(){
		OutputClient({
			action: "Stat", 
			data: {
				Status: "Play",
				life: this.life,
				deaths: this.deaths,
				kills: this.kills
			}
		});
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
			
			Output(mess);	
	}
	
	Gamer.init = function(mess){
		this.pos = {x: mess.pos.x, y: mess.pos.y};
		this.id = mess.id;
		this.dir = mess.dir;
		this.life = this.beg_life;
		
		this.scan_timer = setInterval(Gamer.scan.bind(Gamer), 40);
		this.stat_timer = setInterval(Gamer.upStat.bind(Gamer), 140);
	}
	
	Gamer.update = function(mess){
		this.pos = {x: mess.pos.x, y: mess.pos.y};
		this.dir = mess.dir;
	}
	
	Gamer.destroy = function(){
		clearInterval(this.scan_timer);
		clearInterval(this.stat_timer);
	}
	
	function Resp(){
		if(Gamer.online) Output({
			action: "Create",
			type: "Gamer",
			source: Gamer.adress,
			box: {w: Gamer.box.w, h: Gamer.box.h},
			sprite: "tank"
		});
	}
	
	function Off(){
		 Gamer.destroy();
		 
		 Output({
			action: "Dell",
			type: "Gamer",
			id: Gamer.id,
			source: Gamer.adress,
		});
	}
	
	function Damage(mess){
		Gamer.life--;
		
		if(Gamer.life <= 0){
			Death(mess.killer);
		}
	}
	
	function Death(killer){
		Off();
		Gamer.deaths++;
		Output({
			action: "Kill",
			killer: killer,
			casualty: Gamer.adress,
			adr: game_mod_adr
		});
		
		Resp();
	}
	
	function InputClient(mess){
		switch(mess.action){
			case "Move": Gamer.new_dir = mess.dir; break;
			case "Fire": Gamer.press_fire = true; break;
		}
	}
	
	function Input(mess){
		if(mess.action == 'Connect'){
			Gamer.adress = mess.adr;
			return;
		}
		
		if(mess.action == "Damage"){
			Damage(mess); 
			return;
		}
		
		if(mess.action == "Kill"){
			Gamer.kills++; 
			return;
		}
		
		if(mess.action == "Win" || mess.action == "Lose"){
			OutputClient({
				action: "Stat", 
				data: {
					Status: mess.action,
					Winner: mess.winner,
					life: Gamer.life,
					deaths: Gamer.deaths,
					kills: Gamer.kills
				}
			});
			
			Gamer.destroy();
			Gamer.online = false;
			
			return;
		}
		
		if(mess.type == "Map"){
			switch(mess.action){
				case "Create": Gamer.is_map = true; break;
				case "Dell": Gamer.is_map = false; break;
			}
		}
		
		if(mess.type == 'Gamer' && mess.source == Gamer.adress){
			switch(mess.action){
				case "Create": Gamer.init(mess); break;
				case "Update": Gamer.update(mess); break;
			}
		}
		
		
		
		if(Gamer.is_map) OutputClient(mess);
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

module.exports = CrGamer;
