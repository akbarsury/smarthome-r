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

type NodeStorageObject = {
    credential?: string
    token?: string
    active: boolean
    data?: []
}

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
        const updateUser = (id: string, userData: { name?: string, email?: string }) => this.auth.updateUser(id, userData)
        const updatePassword = (id: string, password: string) => this.auth.updateUser(id, { password })
        return { get, getByUid, getByEmail, add, remove, updateUser, updatePassword }
    }

    nodes = () => {
        const register = async (serialNumber: string) => {
            const credential = encryption().encrypt(`${useRuntimeConfig().SmarthomeCredential}|${new Date().getTime()}`, useRuntimeConfig().SmarthomeCredential)
            const token = credential ? encryption().encrypt(serialNumber, credential) : undefined
            if (credential && token) {
                const nodeStorage: NodeStorageObject = {
                    credential,
                    token,
                    active: false
                }
                await this.storage.setItem(`node:${serialNumber}`, nodeStorage)
                return nodeStorage
            }
        }
        const activate = async (serialNumber: string, token: string) => {
            let node = await this.storage.getItem(`node:${serialNumber}`) as NodeStorageObject
            const maybeSerialNumber = node.credential ? encryption().decrypt(token, node.credential) : undefined
            if (maybeSerialNumber === serialNumber) {
                node = { active: true }
                await this.storage.setItem(`node:${serialNumber}`, node)
                return node
            }
        }
        const get = () => this.storage.getKeys("node")
        const use = (serialNumber: string) => this.storage.getItem(`node:${serialNumber}`)

        return { register, activate, get, use }
    }
}

export default SmarthomeStorage