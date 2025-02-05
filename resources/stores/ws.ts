import { defineStore } from 'pinia';


export const useWsStore = defineStore('ws', () => {
    const user = useCookie('us_auth').value = process.env.NODE_ENV === 'development' ? 'kirimkeakbar' : undefined

    const webSocket = useSmarthomeFE().WebSocket
    const initNodeWebSocket = async (nodeId: string) => {
        if (user) {
            const initStatus = useIntervalFn(async () => {
                if (!initStatus.isActive) return
                const { _value } = await useApiFetch('/init')
                if (_value.value?.token) {
                    const token = useCookie('us_token')
                    token.value = _value.value?.token
                    webSocket.nodeConnect(nodeId, token.value)
                    initStatus.pause()
                }
            }, 1000)
        }
    }

    return {
        user,
        webSocket,
        initNodeWebSocket
    }
});
