import type { H3Event } from 'h3';
import { useUnit, useUnitControlledItems } from './utils/controlledItems'
import { default as _encryption } from './utils/encryption'
import { SmarthomeWebsocket } from './utils/SmarthomeWebsocket'
import { smarthomeWebsocketHandler } from './utils/smarthomeWebsocketHandler'
import SmarthomeStorage from './utils/smarthomeStorage';
import { RequestHandler } from './utils/requestHandler';

const useSmarthome = () => {
    const encryption = _encryption()

    const storage = new SmarthomeStorage()

    const requestHandler = (event: H3Event) => new RequestHandler(event)

    const unit = () => {
        const get = async () => (await useUnit()).get()
        const validate = async (unitName: string) => (await useUnit()).validate(unitName)
        const add = async (unitName: string, data: any[]) => (await useUnit()).add(unitName, data)
        const sync = async (unitName: string, data: any[]) => (await useUnit()).sync(unitName, data)
        return { get, validate, add, sync }
    }
    const getControlledItems = async (unit: string) => {
        return await useUnitControlledItems(unit)
    }
    const webSocket = () => {
        const _data = new SmarthomeWebsocket()
        const ws = smarthomeWebsocketHandler(_data)
        return { _data, ws }
    }

    return { encryption, storage, requestHandler, unit, getControlledItems, webSocket }
}

export default useSmarthome