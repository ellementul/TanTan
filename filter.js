function CrRouting(testes){
	var adr_arr = [];
	
	this.connRecip = function(call_func){
		if(testes[0]){
			this.input = function(val){
				testes[0](val);
				call_func(val);
			};
		}else this.input = call_func;
		
		this.connect = function(call_func){
			var adr = adr_arr.push(call_func) - 1;
			
			call_func({action: "Connect", adr: adr});
			return this.input;
		}
		
		return function(mess){
			if(adr_arr[mess.adr]){
				if(testes[1]) testes[1](mess);
				adr_arr[mess.adr](mess);
			}
		}
	}
}
//Modules

if(typeof module === "object") module.exports = CrRouting;
