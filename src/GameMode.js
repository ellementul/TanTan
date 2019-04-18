function CrGameMode(Router, Param){
	var Output = Router.connect(Input);
	
	var List_Adr = [];
	
	
	function Input(mess){
		switch(mess.action){
			case "Reg": AddAdr(mess); break;
			case "Kill": Kill(mess); break;
		}
	}
	
	function AddAdr(mess){
		List_Adr[mess.source] = {
			login: mess.login,
			kills: 0,
			deaths: 0 
		};
	}
	
	function Kill(mess){
		List_Adr[mess.killer].kills++;
		List_Adr[mess.casualty].deaths++;
		Output({
			action: "Kill",
			adr: mess.killer
		});
		
		if(List_Adr[mess.killer].kills >= Param.max_kills) Win(mess.killer);
	}
	
	function Win(winner){
		var win_login = List_Adr[winner].login;
		
		List_Adr.forEach(function(gamer, i){
			if(gamer){
				Output({
					action: (i == winner)? "Win" : "Lose",
					winner:  win_login,
					adr: i
				});
			}
		});
	}

}

module.exports = CrGameMode;
