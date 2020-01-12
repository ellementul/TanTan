function CrManager(Router){

	

	return function AddClient(client){
		let send = client.connect(console.log);

		send({
			action: "Update",
			type: "GUI",
			setBackground: ["img","background.jpg"],
		});
	}

}

module.exports = CrManager;