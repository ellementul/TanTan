require("../lib/mof.js");

module.exports = CrClient;

function CrClient(Roter, Ready, Destroy){
	var bul_adr = "Bullets";
	var game_mod_adr = "GameMode";

	var GamerData = null;
	
	
	var Send = {
		client: null,
		map: Roter.connect(Input),
		bullet: function(mess){
			mess.adr = bul_adr;
			this.map(mess);
		},
		mode: function(mess){
			mess.adr = game_mod_adr;
			this.map(mess);
		}
	};


	var Gamer = new CrGamer(Send, Death);
	
	this.Resp = Resp;
	this.Connect = function(Client){
		Send.client = Client.connect(InputClient);
		
		GamerData = Client.data;

		Gamer.login = Client.login;
		Send.client({action: "Stat", data: {Status: "Watch other gamers", login: Gamer.login}});

		Send.map({action: "Reg", login: Gamer.login, source: Gamer.adress, adr: game_mod_adr});
		Send.map({action: "Create", type: "Tiles", source: Gamer.adress, gamer_tile: GamerData.tile});
		
		Client.disconnect = Disconnect;
		Gamer.online = true;
		
		return this;
	};

	function Disconnect(){
		Off();
		Send.client = null;
		Gamer.online = false;
		Destroy();
	}

	

	function Death(killer){
		Off();
		Gamer.deaths++;
		Send.mode({
			action: "Kill",
			killer: killer,
			casualty: Gamer.adress
		});
		
		Resp();
	}

	function Resp(){
		if(Gamer.online) Send.map({
			action: "Create",
			type: "Gamer",
			source: Gamer.adress,
			box: {w: Gamer.box.w, h: Gamer.box.h},
			sprite: "tank"
		});
	}
	
	function Off(){
		Gamer.destroy();
		 
		Send.map({
			action: "Dell",
			type: "Gamer",
			id: Gamer.id,
			source: Gamer.adress,
		});
	}
	
	
	function InputClient(mess){
		switch(mess.action){
			case "Move": Gamer.new_dir = mess.dir; break;
			case "Fire": Gamer.press_fire = true; break;
		}
	}
	
	
	function Input(mess){
		if(mess.action == 'Connect'){
			Gamer.adress = mess.adress;
			return;
		}

		if(mess.action == 'Create' && mess.type=='Tiles' &&  mess.source == Gamer.adress){
			GamerData.tile.id = mess.id_gamer_tile;
			Send.client({
				action: mess.action,
				type: mess.type,
				tiles: mess.tiles
			});
		}
		
		if(mess.action == "Damage"){
			Gamer.damage(mess);
			return;
		}
		
		if(mess.action == "Kill"){
			Gamer.kills++; 
			return;
		}
		
		if(mess.action == "Win" || mess.action == "Lose"){
			Send.client({
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
		
		
		
		if(Gamer.is_map){
			delete mess.source;
			Send.client(mess);
		}
	}
	
	
}

function CrGamer(Send, Death){
	var Gamer = {
		online: false,
		dir: 0,
		speed: 7,
		box: {w: 0.9, h: 0.9},
		beg_life: 3,
		kills: 0,
		deaths: 0
	};

	var Gun = new CrGun("Bullet", 7);

	CrDir(Gamer);

	Gamer.init = function(mess){
		this.pos = {x: mess.pos.x, y: mess.pos.y};
		this.id = mess.id;
		this.dir = mess.dir;
		this.life = this.beg_life;
		
		this.scan_timer = setInterval(Gamer.scan.bind(Gamer), 40);
		this.stat_timer = setInterval(Gamer.upStat.bind(Gamer), 140);
	}

	Gamer.destroy = function(){
		clearInterval(this.scan_timer);
		clearInterval(this.stat_timer);
	}

	Gamer.update = function(mess){
		this.pos = {x: mess.pos.x, y: mess.pos.y};
		this.dir = mess.dir;
	}

	Gamer.upStat = function(){
		Send.client({
			action: "Stat", 
			data: {
				Status: "Play",
				life: this.life,
				deaths: this.deaths,
				kills: this.kills
			}
		});
	}	
	
	
	Gamer.scan = function(){
		
		if(this.is_changed || this.move){
			this.updateDir();

			var speed = 0;
			if(this.move)
				speed = this.speed;
			
			var mess = {
				action: "Move",
				type: "Gamer",
				id: this.id,
				dir: this.dir,
				speed: speed
			};
			
			Send.map(mess);
		}
		
		if(this.press_fire) Gamer.fire();
	}

	Gamer.fire = function(){
		this.press_fire = false;

		if(Gun.is_recharge)
			return;
		
		var axis = 'x';
		var dir = 1;
		switch(this.dir){
			case -0.5: dir = -1;
			case 0.5: axis = "y"; break;
			case 1:
			case -1: dir = -1; break;
		}
		
		var b_pos = {x: this.pos.x, y: this.pos.y};
		b_pos[axis] += dir * (this.box.h + 0.05);
		
		var mess = {
			action: "Fire",
			source: this.adress,
			pos: {x: +b_pos.x.toFixed(2), y: +b_pos.y.toFixed(2)},
			dir: this.dir
		};
		
		Send.bullet(mess);

		Gun.is_recharge = true;
	}

	Gamer.damage = function(mess){
		Gamer.life--;
		
		if(Gamer.life <= 0){
			Death(mess.killer);
		}
	}

	return Gamer;
}

function CrGun(bull_type, recharge){
	var is_recharge = false;

	this.addGetSet("is_recharge", 
		function(){
			return is_recharge;
		}, 
		function(val){
			is_recharge = val;
			if(is_recharge)
				setTimeout((
					() => is_recharge = false
				), 100*recharge);
		}
	);
}

function CrDir(obj){
	var dir = null;
	obj.is_move = false;

	obj.addGetSet('new_dir', 
		function(){return dir},
		function(new_dir){
			if(dir === null){
				dir = new_dir;
				obj.is_changed = true;
			}
		}
	);
	obj.updateDir = function(){
		obj.move = false;

		if(obj.dir == dir)
			obj.move = true;

		if(dir != null){
			obj.dir = dir; 
		}

		obj.is_changed = false;
		dir = null;
	};
}
