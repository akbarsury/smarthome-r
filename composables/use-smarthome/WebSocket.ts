import type { UseWebSocketReturn } from "@vueuse/core"
import { webSocketOptions } from "./webSocketOptions"
import z from "zod"

export const MessagesSchema = {
    bind: z.object({
        nodeId: z.string()
    })
}

export class WebSocket {

    constructor() {
        this._data = ref(undefined)
    }

    private _data: globalThis.Ref<{
        name: string,
        ws: UseWebSocketReturn<any>
    } | undefined>

    onReady = (cb: () => void) => {
        const waitWebSocketInterval = useIntervalFn(() => {
            console.log("waiting webSocket");
            console.log({ wsdata: this._data });
            if (this._data.value) {
                waitWebSocketInterval.pause()
                cb()
            }
        }, 1000)
    }

    send = <T extends keyof typeof MessagesSchema, S = z.infer<typeof MessagesSchema[T]>>(key: T, data: S) => this._data.value ? this._data.value.ws.send(JSON.stringify({ key, data })) : null

    nodeConnect = (nodeId: string, accessToken: string) => {
        const this_data = {
            name: "node",
            ws: useWebSocket(
                `${useNitroOrigin()}/_ws/node?nodeId=${nodeId}&token=${accessToken}`,
                webSocketOptions
            )
        }
        this._data.value = this_data
    }
}