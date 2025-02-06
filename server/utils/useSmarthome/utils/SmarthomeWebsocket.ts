import { type Peer } from "crossws"

export class SmarthomeWebsocket {
    constructor() {
        this.jobs = []
        this.clients = {}
    }

    private unit?: string;
    private nodePeer: Peer | undefined;

    private clients: Record<string, Peer>;

    private jobs: {
        id: string,
        peer: Peer,
        job: any
    }[];

    getPeerHeaders = (peer: Peer) => Object.fromEntries(peer.request.headers.entries())

    getPeerRequest = (peer: Peer) => {
        const headers = this.getPeerHeaders(peer)
        return {
            url: peer.request.url,
            path: peer.request.url.split(headers.origin).pop()?.split("?")[0],
            query: Object.fromEntries(peer.request.url.split(headers.origin).pop()?.split("?").pop()?.split("&")
                .filter((queryString) => queryString.split("=", 2).length === 2)
                .map((queryString) => queryString.split("=")) || [[]]),
            headers
        }
    }

    getSession = async (peer: Peer) => {
        const headers = this.getPeerHeaders(peer)
        return await $fetch<Partial<Apis.Session.Session>>(`${headers.origin}/auth/session/`, {
            headers: {
                cookie: headers.cookie
            }
        })
    }

    initClient = async (peer: Peer): Promise<{ status: "initiated" | "ready-initiated", id: string } | null> => {
        const session = await this.getSession(peer)
        if (!session.user) return null
        this.clients[session.user.email] = peer
        console.log(Object.keys(this.clients));
        return {
            status: "initiated",
            id: peer.id
        }
    }

    destroyClient = (peer: Peer) => {
        const id = Object.entries(this.clients).find((clientsEntries) => clientsEntries[1].id === peer.id)?.[0]
        if (!id) return null
        delete this.clients[id]
        console.log(Object.keys(this.clients));
        return peer.id
    }

    updateUnit = (unitName: string) => {
        this.unit = unitName
    }

    // isClientInitiated = async (peer: Peer): Promise<boolean> => this.clientToInit.includes(peer.id) ? false : true

    isNodePeer = (peer: Peer): boolean => peer === this.nodePeer

    nodeConnect = async (peer: Peer): Promise<boolean> => {
        this.nodePeer = peer;
        this.nodePeer.unsubscribe('client');
        return this.nodePeer ? true : false
    }

    nodeDisconnect = async (): Promise<boolean> => {
        this.nodePeer = undefined
        return this.nodePeer ? false : true
    }

    messageHandler = async (peer: Peer, message: string) => {
        const messageJson: {
            requestAction: string,
            [key: string]: any
        } = JSON.parse(message)

        let messageResponse: {
            err?: string
            message?: string,
            data?: typeof messageJson
        } | null

        const _default = async () => {
            messageResponse = null
            // if (messageJson.requestAction === 'assign-node-server') {
            //     if (messageJson.credential === useRuntimeConfig().wsNodeCredential) {
            //         await this.nodeConnect(peer).then((nodeConnectStatus) => {
            //             console.log(nodeConnectStatus ? "Node connect success" : "Node connect failed");
            //         })
            //     }
            // }
            if (peer === this.nodePeer) await nodeMessageHandler()
            else {
                messageResponse = {
                    err: "Invalid message",
                    message
                }
                if (process.env.NODE_ENV === "development") peer.send(JSON.stringify(messageResponse));
                // peer.terminate();
            }

            return messageResponse;
        }

        const nodeMessageHandler = async (): Promise<string | undefined> => {
            switch (messageJson.requestAction) {
                case 'Response-task':
                    return undefined
                case 'Sync':
                    console.log(
                        '// tes send to client'
                    );
                    peer.publish('client', message)

                    return undefined
                default:
                    return undefined
            }
        }

        const clientMessageHandler = async (): Promise<string | undefined> => {
            switch (messageJson.requestAction) {
                case 'Job':
                    server().handleJob();
                    return undefined
                default:
                    return undefined
            }
        }

        const server = () => {
            const handleJob = () => {
                const jobHandler = message.split("::")
                const jobId = `${peer.id}@${new Date().getTime()}`
                const jobToTaskConverter = () => {
                    return `Task::${jobId}::-----`
                }
                const addJobtoJobs = () => {
                    const jobObject = {
                        id: jobId,
                        peer,
                        job: JSON.parse(jobHandler[1])
                    }
                    this.jobs.push(jobObject)
                }
                try {
                    console.log({ 'job-length': this.jobs.length });

                    if (this.jobs.length === 0 && this.nodePeer !== undefined) {
                        this.nodePeer.send(jobToTaskConverter())
                        addJobtoJobs()
                    } else if (this.nodePeer !== undefined) {
                        addJobtoJobs()
                    }
                } catch (err) {
                    peer.send(`Error-job::${jobId.split('@')[1]}`)
                    peer.send({ err })
                }
            }

            return { handleJob }
        }

        const thisFunctionResponse = await _default()

        return thisFunctionResponse
    }
}