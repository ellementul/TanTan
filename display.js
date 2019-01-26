function CrDisplay(){
	var Input = CrHoarder();
	
	var Stat = {data: {}};
	var World = null;
	var List = {};
	
	var app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
	document.body.appendChild(app.view);
	
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
	
	var textures = {};
	
	PIXI.loader.add('fon.svg')
	.add('green_tank.png')
	.add('yellow_tank.png')
	.add('block.jpg')
	.add('bullet.svg')
	.load(function(loader, resources){
		textures.fon = new PIXI.Sprite(resources['fon.svg'].texture);
		textures.tank0 = new PIXI.Sprite(resources['green_tank.png'].texture);
		textures.tank1 = new PIXI.Sprite(resources['yellow_tank.png'].texture);
		textures.block = new PIXI.Sprite(resources['block.jpg'].texture);
		textures.bullet = new PIXI.Sprite(resources['bullet.svg'].texture);
		Input.take(InputMess);
		Input = InputMess;
	}); 
	

	
	
	return function(val){
		Input(val);
	}
	
	function InputMess(mess){
		switch(mess.action){
			case "Create": CrObj(mess); break;
			case "Update": UpObj(mess); break;
			case "Dell": DellObj(mess); break;
			case "Stat": Stat.write(mess.data); break;
		}
	}
	
	function CrObj(mess){
		switch(mess.type){
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
		
		var elem = new PIXI.Sprite(textures[mess.sprite].texture);
		elem.anchor.set(0.5);
		
		elem.x = mess.pos.x * size_cof;
		elem.y = mess.pos.y * size_cof;
		
		elem.width = size_cof * mess.box.w * 2;
		elem.height = size_cof * mess.box.h * 2;
		
		if(mess.dir !== undefined) elem.rotation = mess.dir * (Math.PI/2);
		
		World.add(elem);
		
		if(!List[mess.type]) List[mess.type] = [];
		List[mess.type][mess.id] = elem;
	}
	
	function DellElem(mess){
		List[mess.type][mess.id].destroy();
		List[mess.type][mess.id] = undefined;
	}
	
	function UpdateElem(mess){
		var elem = List[mess.type][mess.id];
		
		if(mess.pos){
			elem.x = mess.pos.x * World.size_cof;
			elem.y = mess.pos.y * World.size_cof;
		}
		if(mess.dir !== undefined) elem.rotation = mess.dir * (Math.PI/2);
	}

//============MAP===============

	function CrMap(mess){
		var world = new PIXI.Container();
		world.x = (window.innerWidth - window.innerHeight) / 2 ;
		app.stage.addChild(world);
		
		var fon = textures.fon;
		fon.height = app.screen.height;
		fon.width =  app.screen.height;
		world.addChild(fon);
		
		World = {};
		World.size_cof = window.innerHeight / mess.size; //Кофф. для перевода коорд. из серверных в дисплейные.
		World.add = function(obj){
			world.addChild(obj);
		}
		World.dell = function(){
			world.destroy();
			World = null;
		}
	}
	
	
	
}

//Избавиться от лагов, сделать размер окна динамичным
