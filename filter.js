function CrRouting(testes, is_log){
	var adr_arr = [];
	
	this.testes = testes;
	
	this.input = function(mess){
		if(!mess.adr && mess.adr !== 0) mess.adr = "Default";
		
		var adr = mess.adr;
		if(testes[adr]) testes[adr](mess);
		
		delete mess.adr;
		if(is_log) console.log("SEND", "Adress: " + adr, mess);
		if(adr_arr[adr]) adr_arr[adr](mess); else throw new Error("Func on adress(" + adr +  ") is not find!");
		
		
	}
	
	this.connect = function(call_func, adr){
		if(adr || adr === 0) adr_arr[adr] = call_func; else{
			adr = adr_arr.push(call_func) - 1;
			call_func({action: "Connect", adr: adr});
		}
		return this.input;
	}
}
//Modules

if(typeof module === "object") module.exports = CrRouting;
