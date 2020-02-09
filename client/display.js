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
	const Loader = PIXI.Loader.shared;

	

	function loadImages(msg){
		msg.resources.forEach(({id, fullPath}) => Loader.add(id, fullPath.join('/')));
		Loader.load();
	}
	

//==================INPUT===============	
	
	this.input =  function(val){
		inputMess(val);
	}

	return this;

	function inputMess(msg){
		switch(msg.type){
			case "Resources": inputResources(msg); break;
			case "Actor": InputActors(msg); break;
			case "GUI": gui.update(msg); break;
			case "World":  inputWorld(msg); break;
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

	function inputWorld(msg){
		switch(msg.action){
			case "Load":  CrWorld(msg); break;
			default: console.error("Mess of Unknowed action", msg);
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
			action: "Ready",
			type: "World"
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
	
	function CrActor({idImage, coords, sizes}){

		let initSprite = () =>{
			size_cof = World.size_cof;
		
			var sprite = new PIXI.Sprite(Loader.resources[idImage].texture);

			sprite.anchor.set(0.5);
			
			sprite.x = coords.x * size_cof + (sizes.w / 2);
			sprite.y = coords.y * size_cof + (sizes.h / 2;
			
			sprite.width = size_cof * sizes.w;
			sprite.height = size_cof * sizes.h;
			
			//if(mess.dir !== undefined) elem.rotation = mess.dir * Math.PI;
			
			app.stage.addChild(sprite);
		}

		if(Loader.progress < 100)
			Loader.on("load",  initSprite);
		else
			initSprite();
			
		
		//World.add(sprite);
		
		//if(!List[mess.actor_type]) List[mess.actor_type] = [];
		//List[mess.actor_type][mess.id] = elem;
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

	function CrWorld({ size, actors }){
		var world = new PIXI.Container();
		world.x = (window.innerWidth - window.innerHeight) / 2 ;
		app.stage.addChild(world);
		
		World = {};
		World.size_cof = window.innerHeight / size; //Кофф. для перевода коорд. из серверных в дисплейные.
		
		World.add = function(sprite){
			
			//world.addChild(obj);
		}

		World.dell = function(){
			world.destroy();
			World = null;
		}

		actors.forEach(CrActor);

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
