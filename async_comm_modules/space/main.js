function CrMap(Commun){

	let List = {
		Gamer: new Map(),
		Bullet: new Map(),
		walls: new Map(),
	};

	CrMovingLoop(List.Gamer, Move);
	CrMovingLoop(List.Bullet, Move);
	
	let send = Commun.connect(input);

	function input(msg){
		switch(msg.action){
			case "Connected": init(); break;
			case "Add": actionAdd(msg); break; 
			default: throw new TypeError(JSON.stringify(msg, "", 4));
		}
	}

	function init(){
		send.gamers = msg => {msg.adr = "Gamers"; send(msg);}
	}

	function actionAdd({ id, coords, collisFig, idImage, source}){
		List.walls.set(id, {
			coords,
			collisFig,
			idImage,
		});

		send({
			action: "AddedWall",
			id,
			success: true,
			adr: source
		})

		send.gamers({
			action: "Added",
			type: "Actor",
			id,
			coords,
			size: collisFig.size,
			idImage,
		});
	}

	function Move(){
		console.log("Move!!!");
	}
}

CrMap.types = {
	input: require("./inputType.js"),
	output: {test: () => false},
};
module.exports = CrMap;

function CrMovingLoop(Objects, Move){
	setInterval(Objects.forEach.bind(Objects, function(obj){
		if(obj) Move(obj);
	}), 40);
}