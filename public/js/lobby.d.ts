/// <reference path="../../DefinitelyTyped/socket.io-client/socket.io-client.d.ts" />

declare class AppViewModel {
    constructor(socket: SocketIOClient.Socket);
    bindSocketEmitters() : void;
    bindSocketHandlers() : void;
}

export = AppViewModel;
