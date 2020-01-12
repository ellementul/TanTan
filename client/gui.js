module.exports = function CrGui(view){

	document.body.appendChild(view);

	return {
		update,
	}

	function update(msg){
		
		if(msg.setBackground)
			document.body.style.background = "url("+ msg.setBackground.join("/") +")";
	}
};