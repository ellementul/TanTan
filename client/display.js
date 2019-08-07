function CrDisplay(){
	var Input = CrHoarder();
	
	var Stat = {data: {}};
	var World = null;
	var List = {};
	
	var app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
	document.body.appendChild(app.view);
	
//==================STAT==============================
	
	var stat = document.createElement("div");
	stat.style.position = "fixed";
	document.body.insertBefore(stat, app.view);



	Stat.write = function(obj){
		for (var key in obj){
			this.data[key] = obj[key];
		}
		
		var str = "";
		for (var key in this.data){
			str += key + ": " + this.data[key] + "<br>";
		}
		stat.innerHTML = "<p>" + str + "</p>";
	};

//===============PreLoadTiles========================

	var Tiles = [];

	function drawSvg(svg_str){
		var img = document.createElement('img');
		img.src = "data:image/svg+xml;base64,"+ Base64.encode(svg_str);
		return PIXI.Sprite.from(img);
	}

	function AddTile(tile){
		tile.images = tile.images.map(drawSvg);
		Tiles[tile.id] = tile;
	}
	
	function LoadTiles(mess){
		mess.tiles.forEach(AddTile);
		ReadyTiles();
	}
	

//==================INPUT===============	
	
	this.input =  function(val){
		InputMess(val);
	}

	return this;

	function InputMess(mess){
		switch(mess.type){
			case "Actor": InputActors(mess); break;
			case "GUI": UpdateGUI(mess); break;
			case "Tiles":  InputTiles(mess); break;
			case "Map":  InputMap(mess); break;
			default: console.error("Mess of Unknowed type", mess); 
		}
	}

	function InputTiles(mess){
		switch(mess.action){
			case "Create":  LoadTiles(mess); break;
			case "Add": AddTile(mess.tile); break;
			default: console.error("Mess of Unknowed action", mess);
		}
	}

	function InputMap(mess){
		switch(mess.action){
			case "Create":  CrMap(mess); break;
			default: console.error("Mess of Unknowed action", mess);
		}
	}

	function InputActors(mess){
		switch(mess.action){
			case "Create": CrObj(mess); break;
			case "Update": UpObj(mess); break;
			case "Dell": DellObj(mess); break;
			default: console.error("Mess of Unknowed action", mess);
		}
	}

	function ReadyTiles(){
		this.output({
			action: "ReadyLoad",
			type: "Tiles"
		});
	}

	function ReadyMap(){
		this.output({
			action: "ReadyLoad",
			type: "Map"
		});
	}

	function UpdateGUI(mess){
		Stat.write(mess.data);
	}

//===============Objects==================
	
	function CrObj(mess){
		switch(mess.type){
			case "Tiles": LoadTiles(mess); break;
			case "Map": CrMap(mess); break;
			default : CrElem(mess); break;
		}
	}
	
	function UpObj(mess){
		switch(mess.type){
			case "Map": ; break;
			default : UpdateElem(mess); break;
		}
	}
	
	function DellObj(mess){
		switch(mess.type){
			case "Map": World.dell(); break;
			default : DellElem(mess); break;
		}
	}
	
	function CrElem(mess){
		size_cof = World.size_cof;
		
		var elem = new PIXI.Sprite(Tiles[mess.sprite].images[0].texture);
		elem.anchor.set(0.5);
		
		elem.x = mess.pos.x * size_cof;
		elem.y = mess.pos.y * size_cof;
		
		elem.width = size_cof * mess.box.w * 2;
		elem.height = size_cof * mess.box.h * 2;
		
		if(mess.dir !== undefined) elem.rotation = mess.dir * Math.PI;
		
		World.add(elem);
		
		if(!List[mess.actor_type]) List[mess.actor_type] = [];
		List[mess.actor_type][mess.id] = elem;
	}
	
	function DellElem(mess){
		List[mess.actor_type][mess.id].destroy();
		List[mess.actor_type][mess.id] = undefined;
	}
	
	function UpdateElem(mess){
		var elem = List[mess.actor_type][mess.id];
		
		if(mess.pos){
			elem.x = mess.pos.x * World.size_cof;
			elem.y = mess.pos.y * World.size_cof;
		}
		if(mess.dir !== undefined) elem.rotation = mess.dir * Math.PI;
	}

//============MAP===============

	function CrMap(mess){
		var world = new PIXI.Container();
		world.x = (window.innerWidth - window.innerHeight) / 2 ;
		app.stage.addChild(world);
		
		World = {};
		World.size_cof = window.innerHeight / mess.size; //Кофф. для перевода коорд. из серверных в дисплейные.
		World.add = function(obj){
			world.addChild(obj);
		}
		World.dell = function(){
			world.destroy();
			World = null;
		}
		
		ReadyMap();
	}
	
	
	
}

function CrHoarder(){
	var hoarder = [];
	
	var push = function(val){
		hoarder.push(val);
	};
	
	push.take = function(func){
		if(typeof func != "function") return hoarder;
		
		hoarder.forEach(function(val){
				func(val);
		});
	}
	
	return push;
}

module.exports = CrDisplay;
