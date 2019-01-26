var onlyClient = false;
var Map_data = {
		resp: [{pos: {x: 1, y: 1}, dir: 1}, {pos: {x: 15, y: 15}, dir: 3}],
		size: 16,
		data: []
};

if(onlyClient){
	var InterMap = new CrRouting([], true);
	CrMap(InterMap, Map_data);
	
	CrBullets(InterMap);
	
//================OneGamer============	

	var InterDisp = new CrInterfice([CrTypeKeyBoard(), CrTypeDisplay()]);
	InterDisp.is_test = true;
	CrKeyboard(InterDisp.connect(CrDisplay()), [65, 68, 83, 87, 32]);

	var GamerOne = new CrGamer(InterDisp, InterMap);
	GamerOne.RespGamer();
	
//================TwoGamer=============

	InterDisp = new CrInterfice([CrTypeKeyBoard(), CrTypeDisplay()]);
	InterDisp.is_test = true;
	CrKeyboard(InterDisp.connect(function(){}), [37, 38, 39, 40, 45]);

	var GamerTwo = new CrGamer(InterDisp, InterMap);
	GamerTwo.RespGamer();
	
}else{
	
	var InterWs = new CrInterfice([CrTypeKeyBoard(), CrTypeDisplay()], "Disp");
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

