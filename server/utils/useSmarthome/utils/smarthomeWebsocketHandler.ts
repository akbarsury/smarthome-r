import { Peer, type Hooks } from "crossws"
import { SmarthomeWebsocket as _SmarthomeWebsocket } from './SmarthomeWebsocket';
import SmarthomeStorage from "./SmarthomeStorage";
import { UrlParse } from "./UrlParse";

export class SmarthomeWebsocketHandler {

    constructor(private SmarthomeWebsocket: _SmarthomeWebsocket) { }

    private storage = new SmarthomeStorage()
    private socketPath: Record<string, { expires: number, socket: _SmarthomeWebsocket }> = {}
    private peerConnectionMaps: Record<string, string> = {}
    private peerInit = async (peer: Peer, appId: string) => this.peerConnectionMaps[peer.id] = appId
    private peerDestroy = async (peer: Peer) => delete this.peerConnectionMaps[peer.id]
    private peerInitiated = (peer: Peer) => {
        return (typeof this.peerConnectionMaps[peer.id] === "string")
    }
    private getPeerAppId = (peer: Peer): string | undefined => {
        return this.peerConnectionMaps[peer.id]
    }

    hooks: Partial<Hooks> = {
        upgrade: async (request) => {
            console.warn("[WS UPGRADE]");
            const token = request.url.split("?").pop()?.split("&").find((queries) => queries.startsWith("token="))?.replace("token=", "")
            if (token) {
                this.SmarthomeWebsocket.updateUnit(token)
            }
            return
        },

        open: async (peer) => {
            console.log(`Client connection open: ${peer.id}`);
            const appId = "ap3south67"
            const validApp = await this.storage.app.validApp(appId);
            if (validApp) this.peerInit(peer, appId).then(async (appId) => {
                if (!this.socketPath[appId]) this.socketPath[appId] = {
                    expires: new Date().getTime() + (24 * 3600),
                    socket: this.SmarthomeWebsocket
                }
                await this.socketPath[appId].socket.initClient(peer)
            })
        },

        close: async (peer, details) => {
            const peerAppId = this.getPeerAppId(peer)
            if (!peerAppId || !this.socketPath[peerAppId]) return
            this.peerDestroy(peer).then(() => this.socketPath[peerAppId].socket.destroyClient(peer))
            if (this.SmarthomeWebsocket.isNodePeer(peer)) {
                this.SmarthomeWebsocket.nodeDisconnect().then(() => {
                    console.log(`Node connection close: ${peer.id}`);
                }).catch(() => {
                    console.log(`Client connection close: ${peer.id}`);
                });
            } else {
                console.log(`Client connection close: ${peer.id}`);
            }
        },

        message: async (peer, message,) => {
            console.log(`Messege from peer (${peer.id}) : ${message.text()}`);
            const isPeerInitiated = this.peerInitiated(peer)
            if (!isPeerInitiated) return
            const peerAppId = this.getPeerAppId(peer)
            if (!peerAppId || !this.socketPath[peerAppId]) return
            this.socketPath[peerAppId].socket.messageHandler(peer, message.text())
        },

        error: async (peer, error) => {
            const peerAppId = this.getPeerAppId(peer)
            if (!peerAppId || !this.socketPath[peerAppId]) return
            this.peerDestroy(peer).then(() => this.socketPath[peerAppId].socket.destroyClient(peer))
            if (this.SmarthomeWebsocket.isNodePeer(peer)) {
                this.SmarthomeWebsocket.nodeDisconnect().then(() => {
                    console.log(`Node peer (${peer.id}) connection error: `, error);
                }).catch(() => {
                    console.log(`Client peer (${peer.id}) connection error: `, error);
                });
            } else {
                console.log(`Client peer (${peer.id}) connection error: `, error);
            }
        }
    }
}
