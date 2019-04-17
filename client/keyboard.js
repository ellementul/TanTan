function CrKeyboard(sendFunc, keys_codes){
	
	var keys_is_down = new Array(128);
	var key_timer_ids = new Array(128);
	
	document.addEventListener("keydown", eventKeyDouwn);
	document.addEventListener("keyup" , eventKeyUp);
	
	var timer = setInterval(UpdateKeys, 60)
	
	function UpdateKeys(){
		keys_is_down.forEach(function(is, i){
			if(is){
				sendKey(i);
			}
		});
	}
	
	function eventKeyDouwn(event){
		if(keys_codes.indexOf(event.keyCode) != -1){
			var key_code = event.keyCode;
			keys_is_down[key_code] = true;
		}
	}

	function eventKeyUp(event){
		if(keys_codes.indexOf(event.keyCode) == -1) return;
		
		keys_is_down[event.keyCode] = false;
	}

	function sendKey(key_code){
		var mess = {action: "Move"};
		switch(key_code){
			case 39:
			case 68: mess.dir = 0; break;
			case 40:
			case 83: mess.dir = 1; break;
			case 37: 
			case 65: mess.dir = 2; break;
			case 38:
			case 87: mess.dir = 3; break;
			case 32:
			case 45: mess.action = "Fire"; break;
		}
		sendFunc(mess);
	}
	
	function sendPing(){
		sendFunc({action: "Ping"});
	}
};

module.exports = CrKeyboard;
