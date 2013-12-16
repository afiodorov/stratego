function genUniquePlayerName(data) {
	var key = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl" +
				"mnopqrstuvwxyz0123456789";
	do {
		key = "";
		for(var i=0; i<7; i++) {
			key += possible.charAt(Math.floor(Math.random() * possible.length));
	 	}
	} while (key in data);

	return key;
};

module.exports = {
	genUniquePlayerName : genUniquePlayerName
}
