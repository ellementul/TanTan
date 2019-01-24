var onlyClient = false;
var Map_data = {
		resp: [{pos: {x: 1, y: 1}, dir: 1}, {pos: {x: 15, y: 15}, dir: 3}],
		size: 16,
		data: [{
				id: 0,
				sprite: "block",
				pos: {x: 8, y: 5},
				box: {w: 0.5, h: 0.5}
		},{
				id: 1,
				sprite: "block",
				pos: {x: 5, y: 5},
				box: {w: 0.5, h: 0.5}
		}]
};

if(onlyClient){
	var InterMap = new CrRouting([function(val){if(val.action != "Ping") console.log("InputMap: ", val)}, console.log.bind(null, "OutputMap: ")]);
	CrMap(InterMap, Map_data);
	
	CrBullets(InterMap);
	
	var InterDisp = new CrInterfice([CrTypeKeyBoard(), console.log.bind(null, "OutDisp: ")]);
	InterDisp.is_test = true;
	CrKeyboard(InterDisp.connect(CrDisplay()), [65, 68, 83, 87, 32]);

	var GamerOne = new CrGamer(InterDisp, InterMap);
	GamerOne.RespGamer();
	
	InterDisp = new CrInterfice([CrTypeKeyBoard(), console.log.bind(null, "OutDisp: ")]);
	InterDisp.is_test = true;
	CrKeyboard(InterDisp.connect(function(){}), [37, 38, 39, 40, 45]);

	var GamerTwo = new CrGamer(InterDisp, InterMap);
	GamerTwo.RespGamer();
}else{
	var InterWs = new CrInterfice([CrTypeKeyBoard(), console.log.bind(null, "Client-WS: ")]);
	InterWs.is_test = true;
	CrKeyboard(InterWs.connect(CrDisplay()), [65, 68, 83, 87, 37, 38, 39, 40, 32, 45]);


	const socket = new WebSocket('ws://192.168.1.76:8081');

	socket.addEventListener('open', function (event) {
		var InFunc = InterWs.connect(function(mess){
			socket.send(JSON.stringify(mess));
		});
		
		socket.addEventListener('message', function (event) {
			InFunc(JSON.parse(event.data));
		});
	});
}

function CrTypeKeyBoard(){
	var T = Object.types;
	var Type = T.any({
		action: "Move",
		dir: T.pos(4)
	}, {action: "Fire"});
	return function(val){
		if(Type.test(val)) throw Type.test(val);
	}
}

//Добавить инициализцию второго игрока в режиме офлайн
