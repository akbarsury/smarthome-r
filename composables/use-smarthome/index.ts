import { messageHandler as _messageHandler } from "./messageHandler"
import { WebSocket as _WebSocket } from "./WebSocket"

const useSmarthomeFE = (apiPathSyncData?: string) => {
    const WebSocket = new _WebSocket()
    const messageHandler = (message: string) => _messageHandler(message)

    return { WebSocket }
}

export { useSmarthomeFE }