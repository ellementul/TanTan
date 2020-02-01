function CrMap(Commun){

	let List = {
		Gamer: new Map(),
		Bullet: new Map(),
		Block: new Map()
	};

	CrMovingLoop(List.Gamer, Move);
	CrMovingLoop(List.Bullet, Move);
	
	let Output = Commun.connect(Input);

	function Input(msg){
		switch(msg.action){
			case "Connected": break; 
			default: throw new TypeError(JSON.stringify(msg, "", 4));
		}
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