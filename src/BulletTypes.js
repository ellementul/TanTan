require("typesjs");
require("typesjs/str_type");

var T = Object.types;

function CrTypesKeyboard(){
	


	return function(mess){
		switch(mess.action){
			case "Move":
				
				break;
		}
		return mess;
	}
}

function CrTypesDisplay(){
	

	return function(mess){
		
		return mess;
	}
}

function ValidError(test, val){
	if(test(val))
		throw new Error(JSON.stringify({type: test(val), value: val}, "", 4));
}

module.exports = [CrTypesKeyboard(), CrTypesDisplay()];