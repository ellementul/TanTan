const PIXI = require("pixi.js");

const CrGui = require("./gui.js");

function CrDisplay(){
	var Input = CrHoarder();
	
	var Stat = {data: {}};
	var World = null;
	var List = {};
	
	let app = new PIXI.Application(window.innerHeight, window.innerHeight, {backgroundColor : 0x000000});
	const gui = CrGui(app.view);

//===============LoadResources========================
	const loader = PIXI.Loader.shared;

	function loadImages(msg){
		msg.resources.forEach(({id, fullPath}) => loader.add(id, fullPath.join('/')));
		loader.load(loader => console.log(loader.resources));
	}
	

//==================INPUT===============	
	
	this.input =  function(val){
		InputMess(val);
	}

	return this;

	function InputMess(msg){
		switch(msg.type){
			case "Resources": inputResources(msg); break;
			case "Actor": InputActors(msg); break;
			case "GUI": gui.update(msg); break;
			case "Tiles":  InputTiles(msg); break;
			case "Map":  InputMap(msg); break;
			default: console.error("Mess of Unknowed type", msg); 
		}
	}

	function inputResources(msg){
		switch(msg.action){
			case "Load":  loadImages(msg); break;
			default: console.error("Mess of Unknowed action", msg);
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
