export const webSocketOptions = {
    onConnected: (ws: globalThis.WebSocket) => {
        ws.send(JSON.stringify({ requestAction: "client-init" }));
    },
    onDisconnected: (ws: globalThis.WebSocket) => {
        console.log(`WS disconnected: ${ws.url}`);
    },
    onMessage(ws: globalThis.WebSocket, event: MessageEvent<any>) {
        if (typeof event.data === "string") {
        }
    },
    autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
            console.warn("Failed to connect WebSocket after 3 retries");
        },
    },
}