"use strict";

require("../lib/mof.js");

module.exports = CrClient;

function CrClient(Commun){
	var bul_adr = "Bullets";
	var game_mod_adr = "GameMode";
	var manager_adr = "PlayersManager";

	var GamerData = null;

	var IsReadyTiles = false;
	var IsMap = false;
	var IsPlay = false; 
	
	
	var Send = {
		client: null,
		def: Commun.connect(Input),
		map: function(mess){
			this.def(mess);
		},
		bullet: function(mess){
			mess.adr = bul_adr;
			this.def(mess);
		},
		mode: function(mess){
			mess.adr = game_mod_adr;
			this.def(mess);
		},
		manager: function(mess){
			mess.adr = manager_adr;
			this.def(mess);
		}
	};


	var Gamer = new CrGamer(Send, Death);
	
	this.Input = Input;
	this.Connect = function(Client){
		Send.client = Client.connect(InputClient);
		
		GamerData = Client.data;

		Gamer.login = Client.login;
		Send.client({
			action: "Update", 
			type: "GUI", 
			data: {
				Status: "Watch other gamers", 
				login: Gamer.login
			}
		});

		Send.map({
			action: "Reg", 
			login: Gamer.login, 
			source: Gamer.adress, 
			adr: game_mod_adr
		});

		Send.map({
			action: "Create", 
			type: "Tiles", 
			source: Gamer.adress
		});

		Send.map({
			action: "Add", 
			type: "Tiles",
			tile_type: "Gamer",
			tile: GamerData.tile,
			source: Gamer.adress,
		});  
		
		return this;
	};

	this.Ready = function(){
		Resp();
		console.info("Gamer N" + Gamer.adress + " is playing.");
	}

	this.Destroy = function(){
		Off();
	}

	return this;


	

	function Resp(){

		Send.map({
			action: "Create",
			type: "Gamer",
			source: Gamer.adress,
			box: {w: Gamer.box.w, h: Gamer.box.h},
			sprite: GamerData.tile.id
		});

		IsPlay = true;
	}
	
	function Off(){
		Gamer.destroy();
		 
		Send.map({
			action: "Dell",
			type: "Gamer",
			id: Gamer.id,
			source: Gamer.adress,
		});

		IsPlay = false;
	}

	function Death(killer){
		Off();
		Gamer.deaths++;
		Resp();

		Send.mode({
			action: "Kill",
			killer: killer,
			casualty: Gamer.adress
		});
	}
	
	
	function InputClient(mess){
		switch(mess.action){
			case "ReadyLoad": ReadyLoad(mess); break;
			case "Move": if(IsPlay) Gamer.new_dir = mess.dir; break;
			case "Fire": if(IsPlay) Gamer.press_fire = true; break;
		}
	}

	function ReadyLoad(mess){
		switch(mess.type){
			case "Tiles": ReadyTiles(mess); break;
			case "Map": ReadyMap(mess); break;
		}
	}

	function ReadyTiles(mess){
		Send.map({
			action: "Create", 
			type: "Map", 
			source: Gamer.adress
		});
	}

	function ReadyMap(mess){
		ReadyGamer();
	}

	function ReadyGamer(){
		Send.manager({
			action: "Ready",
			type: "Gamer",
			id: Gamer.adress,
		});
	}
	
	
	function Input(mess){

		if(mess.action == 'Connect'){
			Gamer.adress = mess.adress;
			return;
		}

		switch(mess.type){
			case "Tiles": TilesInput(mess); break;
			case "Map": MapInput(mess); break;
			case "Gamer": GamerInput(mess); break;
			case "Actor": ActorInput(mess); break;
			default: console.error("Unknown message: ", mess);
		}
		
	}

	function TilesInput(mess){
		switch(mess.action){
			case "Create": 
				Send.client({
					action: mess.action,
					type: mess.type,
					tiles: mess.tiles
				});

				IsReadyTiles = true;
				break;
			case "Add": AddTile(mess); break;
			default: console.error("Unknown message: ", mess);
		}

	}

	function MapInput(mess){
		switch(mess.action){
			case "Create": IsMap = true; break;
			case "Dell": IsMap = false; break;
		}

		if(IsReadyTiles) 
			Send.client(mess);
		else throw new Error();
	}

	function GamerInput(mess){
		
		switch(mess.action){
			case "Create": Gamer.init(mess); break;
			case "Update": Gamer.update(mess); break;
			case "Damage": Gamer.damage(mess); break;
			case "Kill": Gamer.kills++; break;
			case "Win":
			case "Lose": EndGame(mess); break;
		}
	}

	function EndGame(mess){
		Send.client({
			action: "Update",
			type: "GUI", 
			data: {
				Status: mess.action,
				Winner: mess.winner,
				life: Gamer.life,
				deaths: Gamer.deaths,
				kills: Gamer.kills
			}
		});
		
		Gamer.destroy();
		IsPlay = false;
	}

	function ActorInput(mess){
		
		if(IsMap){
			var new_mess = Object.assign({}, mess);
			delete new_mess.source;
			Send.client(new_mess);
		}
	}
	
	function AddTile(mess){
		if(mess.tile_type == "Gamer"){
			GamerData.tile.id = mess.tile_id;
			return;
		}

		if(IsReadyTiles){
			var new_mess = Object.assign({}, mess);
			delete new_mess.source;
			Send.client(new_mess);
		}
	}
}

function CrGamer(Send, Death){
	var Gamer = {
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
			action: "Update",
			type: "GUI", 
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
