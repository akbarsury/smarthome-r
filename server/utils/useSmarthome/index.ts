import type { H3Event } from 'h3';
import { encryption as _encryption } from './utils/encryption'
import { SmarthomeWebsocket } from './utils/SmarthomeWebsocket'
import { SmarthomeWebsocketHandler } from './utils/smarthomeWebsocketHandler'
import { SmarthomeStorage } from './utils/SmarthomeStorage';
import { RequestHandler } from './utils/requestHandler';
import { UrlParse, type UpgradeRequest } from './utils/UrlParse';

const useSmarthome = () => {
    const encryption = _encryption()

    const urlParse = (request: UpgradeRequest) => new UrlParse(request)

    const storage = new SmarthomeStorage()

    const requestHandler = (event: H3Event) => new RequestHandler(event)

    const getBearer = (event: H3Event) => {
        const authorizationHeader = getHeader(event, "authorization")
        return authorizationHeader && authorizationHeader.startsWith('Bearer ') ? authorizationHeader.replace('Bearer ', '') : undefined
    }

    const webSocket = () => {
        const _data = new SmarthomeWebsocket()
        const ws = new SmarthomeWebsocketHandler(_data).hooks
        return { _data, ws }
    }

    return { encryption, storage, requestHandler, getBearer, webSocket }
}

export { useSmarthome, useSmarthome as default }