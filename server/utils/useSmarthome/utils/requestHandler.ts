import { getServerSession } from '#auth';
import type { H3Event } from 'h3';
import { Session } from 'next-auth';
type RequestHandlerType = "app-client" | "node"

type RequestHandlerResponse = {
    statusCode?: 200 | 400 | 401,
    message?: string,
    session?: Session,
    node?: {
        nodeId: string
    }
}

export class RequestHandler {

    constructor(event: H3Event) {
        this.event = event
    }

    private event: H3Event
    private response: RequestHandlerResponse = {}

    exec = async (handlerType: RequestHandlerType) => {
        if (handlerType === 'app-client') {
            const session = await getServerSession(this.event)
            const isSessionNotExpires = session ? new Date(session.expires).getTime() > new Date().getTime() : false
            this.response = session && isSessionNotExpires ? { statusCode: 200, message: 'authorized', session } : { statusCode: 401, message: 'unauthorized' }
        }
        else if (handlerType === 'node') {
            const { 'X-app-credential': appCredential, 'X-node-serial-number': nodeId } = getRequestHeaders(this.event)
            this.response = (appCredential === useRuntimeConfig(this.event).SmarthomeCredential && nodeId) ? {
                statusCode: 200,
                message: 'authorized',
                node: { nodeId: nodeId }
            } : { statusCode: 401, message: 'unauthorized' }

        }
        return this.response
    }
}