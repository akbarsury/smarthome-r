import admin, { type ServiceAccount } from "firebase-admin";
import serviceAccount from "~/service-account.json"
import encryption from "./encryption";

class FirebaseAdmin {
    private app = admin.apps.length === 0 ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount)
    }, 'default') : admin.app('default')

    public auth = this.app.auth()
    public firestore = this.app.firestore()
}

type NodeStorageObject = Server.Node.PreActivate & Server.Node.General & Server.Node.Items
type NodeObject = Server.Node.SerialNumber | (Server.Node.SerialNumber & NodeStorageObject)

class SmarthomeStorage {
    private storage = useStorage('db')
    private auth = new FirebaseAdmin().auth
    private firestore = new FirebaseAdmin().firestore

    user = () => {
        const get = () => this.auth.listUsers()
        const getByUid = (id: string) => this.auth.getUser(id)
        const getByEmail = (email: string) => this.auth.getUserByEmail(email)
        const add = ({ email, password, name }: { email: string, password: string, name: string }) => this.auth.createUser({
            email,
            password,
            displayName: name
        })
        const remove = (id: string) => this.auth.deleteUser(id).then(() => { return { id } }).catch((e) => undefined)
        const update = (id: string, userData: { name?: string, email?: string }) => this.auth.updateUser(id, userData)
        const updatePassword = (id: string, password: string) => this.auth.updateUser(id, { password })
        return { get, getByUid, getByEmail, add, remove, update, updatePassword }
    }

    nodes = () => {
        const register = async (serialNumber: string, uuid: string) => {
            const credential = encryption().encrypt(`${useRuntimeConfig().SmarthomeCredential}|${new Date().getTime()}`, useRuntimeConfig().SmarthomeCredential)
            const token = credential ? encryption().encrypt(serialNumber, credential) : undefined
            if (credential && token) {
                const nodeStorage: NodeStorageObject = {
                    credential,
                    token,
                    name: serialNumber,
                    active: false,
                    acceptedUsers: [uuid],
                    items: []
                }
                await this.storage.setItem(`node:${serialNumber}`, nodeStorage)
                return nodeStorage
            }
        }
        const activate = async (serialNumber: string, token: string) => {
            let node = await this.nodes().use(serialNumber)
            const maybeSerialNumber = node.credential ? encryption().decrypt(token, node.credential) : undefined
            if (maybeSerialNumber === serialNumber) {
                node = { ...node, active: true, credential: undefined, token: undefined }
                await this.storage.setItem(`node:${serialNumber}`, node)
                return node
            }
        }
        const get = async (options?: { activeOnly?: boolean }) => {
            let nodes: string[] = await this.storage.getKeys("node").then((keys) =>
                keys.map((keyName) => keyName.startsWith("node:")
                    ? keyName.replace("node:", "")
                    : keyName
                ))
            if (options?.activeOnly) {
                nodes = await nodes.reduce<Promise<string[]>>(async (last, current) => {
                    const isActive = (await this.storage.getItem(`node:${current}`) as NodeStorageObject).active === true
                    return isActive ? (await last).concat(current) : last
                }, Promise.resolve([]))
            }
            const withValue = async () => {
                return await nodes.reduce<Promise<NodeObject[]>>(async (last, current) => {
                    const node = {
                        serialNumber: current,
                        ...(await this.storage.getItem(`node:${current}`) as NodeStorageObject)
                    }
                    return (await last).concat(node)
                }, Promise.resolve([]))
            }
            return { nodes, withValue }
        }
        const remove = async (serialNumber: string) => this.storage.removeItem(`node:${serialNumber}`).then(() => { return { serialNumber } }).catch((e) => undefined)
        const update = async (serialNumber: string, update: { general?: Server.Node.General, data?: Server.Node.Items }) => {
            let node = await this.nodes().use(serialNumber)
            node = update.general ? { ...node, ...update.general } : node
            node = update.data ? { ...node, ...update.data } : node
            await this.storage.setItem(`node:${serialNumber}`, node)
            return node
        }
        const use = (serialNumber: string) => this.storage.getItem(`node:${serialNumber}`) as unknown as Promise<NodeStorageObject>

        return { register, activate, get, remove, update, use }
    }
}

export default SmarthomeStorage