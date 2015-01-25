/// <reference path="../../DefinitelyTyped/knockout/knockout.d.ts" />
/// <reference path="../../DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="../../DefinitelyTyped/lodash/lodash.d.ts" />
/// <reference path="../../DefinitelyTyped/socket.io-client/socket.io-client.d.ts" />

import knockout = require('knockout');
import jquery = require('jquery');
import _ = require('lodash');
import io = require('socket.io-client')

import LobbyViewModel = require('./../js/lobby');

var main = function() {
	jquery['pnotify']['defaults']['styling'] = 'jqueryui';

	var origin = window.location.protocol + '//' + window.location.hostname;
	var lobbySocket = io(origin + '/lobby');

	var knockoutHandlersAsAny: any = knockout.bindingHandlers;

		knockoutHandlersAsAny.playerOnline = {};
		knockoutHandlersAsAny.playerOnline.update = function(element,
		valueAccessor, allBindings, viewModel, bindingContext) {

		var players = <Array<{playerName: string}>>
			knockout.utils.unwrapObservable(valueAccessor());

		var isPlayerOnline : boolean = _.any(players, (player) => {
			return player.playerName === bindingContext.$data.opponentName;
		});
		element.style.visibility = isPlayerOnline ? 'visible' : 'hidden';
	};

	var lobbyViewModel  = new LobbyViewModel(lobbySocket);
	lobbyViewModel.bindSocketEmitters();
	knockout.applyBindings(lobbyViewModel);
	lobbyViewModel.bindSocketHandlers();
};

/** entry point **/
jquery(main);
