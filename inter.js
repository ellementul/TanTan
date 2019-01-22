function CrInterfice(testes){
	this.is_test = false; 
	
	var InputOne = null;
	var OutputOne = null;
	
	this.connect = function(outputFunc){
		if(OutputOne){
			if(this.is_test){
				var begFunc = outputFunc;
				outputFunc = function(val){
					testes[0](val);
					begFunc(val);
				}
			}
			return TwoConnect(outputFunc);
		}else{
			if(this.is_test){
				var begFunc = outputFunc;
				outputFunc = function(val){
					testes[1](val);
					begFunc(val);
				}
			}
			return OneConnect(outputFunc);
		}
	};
	
	function OneConnect(outputFunc){
		OutputOne = outputFunc;
		InputOne = CrHoarder();
		
		return function(val){
			InputOne(val);
		}
	}
	
	function TwoConnect(outputFunc){
		if(InputOne.take) InputOne.take(outputFunc);
		InputOne = outputFunc;
		
		return OutputOne;
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

//Modules

if(typeof module === "object") module.exports = CrInterfice;
