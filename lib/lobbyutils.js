function genUniquePlayerName(arr) {
	var key = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl" +
				"mnopqrstuvwxyz0123456789";
  var i;
	do {
		key = "";
		for(i=0; i<7; i++) {
			key += possible.charAt(Math.floor(Math.random() * possible.length));
	 	}
	} while (arr.indexOf(key) !== -1);

	return key;
}

module.exports = {
	genUniquePlayerName : genUniquePlayerName
};
