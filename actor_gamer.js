function CrGamer(InterDisplay, InterMap){

	var Gamer = {
		online: false,
		dir: 1,
		speed: 0.15,
		box: {w: 0.9, h: 0.9}
	};
	CrDir(Gamer);
	
	var OutputDisp = InterDisplay.connect(InputDisp);
	var OutputMap = InterMap.connect(InputMap);
		
	
	
	Gamer.update = function(){
		
		if(this.new_dir !== null){
			
			var dist = 0;
			if(!this.updateDir()) dist += this.speed;
			
			var mess = {
				action: "Move",
				id: this.id,
				dir: this.dir,
				dist: dist
			};
			
			OutputMap(mess);
		}
		
	}
	
	function InputMap(mess){
		if(mess.action == 'Connect'){
			Gamer.adress = mess.adr;
		}
		if(mess.action == 'Create'){
			if(mess.type == 'Gamer'){
				if(mess.source == mess.adr){
					Gamer.pos = {x: mess.pos.x, y: mess.pos.y};
					Gamer.id = mess.id;
					Gamer.dir = mess.dir;
					
					Gamer.online = true;
					Gamer.timer = setInterval(Gamer.update.bind(Gamer), 40);
				}
				OutputDisp(mess);
			}else{
				OutputDisp(mess);
			}
		}
		if(mess.action == 'Update' && Gamer.online){
			if(mess.id == Gamer.id){
				Gamer.pos = {x: mess.pos.x, y: mess.pos.y};
				Gamer.dir = mess.dir;
			}
			OutputDisp(mess);
		}
		if(mess.action == 'Dell'){
			OutputDisp(mess);
		}
		
		
	}
	
	this.RespGamer = function(){
		OutputMap({
			action: "Create",
			type: "Gamer",
			source: Gamer.adress,
			box: {w: Gamer.box.w, h: Gamer.box.h},
			sprite: "tank"
		});
	}
	
	this.OffGamer = function(){
		 clearInterval(Gamer.timer);
		 Gamer.online = false;
		 
		 OutputMap({
			action: "Dell",
			type: "Gamer",
			id: Gamer.id,
			source: Gamer.adress,
		});
	}
	
	function InputDisp(mess){
		if(Gamer.online && mess.action == "Move"){
			Gamer.new_dir = mess.dir;
		}
		
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
