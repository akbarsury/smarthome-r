import admin, { type ServiceAccount } from "firebase-admin";
import { UpdateRequest, type UserRecord } from "firebase-admin/auth";
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
        const toInternalUserAdapter = (user: UserRecord): Partial<Apis.Users.User> | null => {
            return user.uid && user.email ? {
                id: user.uid,
                email: user.email,
                name: user.displayName,
                rule: user.customClaims?.rule
            } : null
        }

        const toFirebaseUserDataAdapter = (user: Partial<Apis.Users.User>): UserRecord | UpdateRequest | null => {
            return user.id && user.email ? {
                uid: user.id,
                email: user.email,
                displayName: user.name,
                rule: undefined,
                customClaims: {
                    rule: user.rule
                }
            } as UserRecord | UpdateRequest : null
        }

        const get = (pageToken?: string) => this.auth.listUsers(100)
            .then((usersList) => usersList.users.map(user => toInternalUserAdapter(user)))
            .catch((e) => null)

        const getByUid = (id: string) => this.auth.getUser(id)

        const getByEmail = (email: string) => this.auth.getUserByEmail(email)

        const add = async (newUser: Omit<Apis.Users.User, "id"> & { password: string }) => await this.auth.createUser({
            email: newUser.email,
            displayName: newUser.name,
            password: newUser.password,
        })
            .then(async (user) => {
                const _user = toInternalUserAdapter(user)
                if (!_user) return _user
                return await update(user.uid, { ..._user, rule: "user" } as Apis.Users.User)
            })
            .catch((e) => null)

        const remove = (id: string) => this.auth.deleteUser(id).then(() => { return { id } }).catch((e) => undefined)

        const update = async (id: string, userRecord: Omit<Apis.Users.User, "id">) => {
            const _user = toFirebaseUserDataAdapter({ id, ...userRecord }) as UpdateRequest | null
            console.log({ userRecord, _user });

            if (!_user) return _user
            return this.auth.updateUser(id, _user).then(async (user: UserRecord) => {
                return userRecord.rule ? await this.auth.setCustomUserClaims(user.uid, { rule: userRecord.rule }).then(async () => {
                    return toInternalUserAdapter({ ..._user, ...user, } as UserRecord)
                }) : toInternalUserAdapter({ ..._user, ...user } as UserRecord)
            })
        }

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
            let nodes: string[] = await this.storage.getKeys("node").then((keys) => keys.map((keyName) => keyName.replace("node:", "")))
            if (options?.activeOnly) {
                nodes = await nodes.reduce<Promise<string[]>>(async (last, current) => {
                    const isActive = (await use(current)).active === true
                    return isActive ? (await last).concat(current) : last
                }, Promise.resolve([]))
            }

            const withValue = async () => {
                return await nodes.reduce<Promise<NodeObject[]>>(async (last, current) => {
                    const serialNumber = current
                    const node = {
                        ...(await use(serialNumber)),
                        serialNumber
                    }
                    return (await last).concat(node)
                }, Promise.resolve([]))
            }
            return { nodes, withValue }
        }

        const remove = async (serialNumber: string) => this.storage.removeItem(`node:${serialNumber}`).then(() => { return { serialNumber } }).catch((e) => undefined)

        const update = async (serialNumber: string, update: { general?: Partial<Server.Node.General>, data?: Server.Node.Items }) => {
            let node = await this.nodes().use(serialNumber)
            let { general, data } = update
            console.log({ general, data });

            node = update.general ? { ...node, ...general } : node
            node = update.data ? { ...node, ...data } : node
            await this.storage.setItem(`node:${serialNumber}`, node)
            return node
        }

        const use = (serialNumber: string) => this.storage.getItem(`node:${serialNumber}`) as unknown as Promise<NodeStorageObject>

        return { register, activate, get, remove, update, use }
    }
}

export default SmarthomeStorage