function CrBullets(InterMap){
	var Actor = {};
	
	var OutputMap = InterMap.connect(InputMap);
		
	function InputMap(mess){
		if(mess.action == 'Connect'){
			Actor.adress = mess.adr;
		}
	}
	
	
}

//Modules

if(typeof module === "object") module.exports = CrBullets;
