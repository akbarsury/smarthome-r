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
type NodeObject = Server.Node.Id | (Server.Node.Id & NodeStorageObject)
type NodeExec = {
    itemIndex: number,
    executionType: "switch" | "push" | "restart",
    clickTime: number
}

class SmarthomeStorage {
    private storage = useStorage("db")
    private auth = new FirebaseAdmin().auth
    private firestore = new FirebaseAdmin().firestore
    userStorage = useStorage("db/users")

    private util = {
        user: {
            toInternalUserAdapter: (user: UserRecord): Partial<Apis.Users.User> | null => {
                return user.uid && user.email ? {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName,
                    rule: user.customClaims?.rule
                } : null
            },

            toFirebaseUserDataAdapter: (user: Partial<Apis.Users.User>): UserRecord | UpdateRequest | null => {
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
        },
        node: {
            use: async (nodeId: string) => {
                const resolvedNode = await this.storage.getItem<NodeStorageObject>(`node:${nodeId}.json`)

                return resolvedNode ? Object.assign(resolvedNode, { nodeId }) : null
            }
        }
    }

    user = {
        get: async (pageToken?: string) => await this.auth.listUsers(100)
            .then((usersList) => usersList.users.map(user => this.util.user.toInternalUserAdapter(user)))
            .catch((e) => null),

        getByUid: async (id: string) => await this.auth.getUser(id),

        getByEmail: async (email: string) => await this.auth.getUserByEmail(email),

        add: async (newUser: Omit<Apis.Users.User, "id"> & { password: string }) => await this.auth.createUser({
            email: newUser.email,
            displayName: newUser.name,
            password: newUser.password,
        })
            .then(async (user) => {
                const _user = this.util.user.toInternalUserAdapter(user)
                if (!_user) return _user
                return await this.user.update(user.uid, { ..._user, rule: "user" } as Apis.Users.User)
            })
            .catch((e) => null),

        remove: (id: string) => this.auth.deleteUser(id).then(() => { return { id } }).catch((e) => null),

        update: async (id: string, userRecord: Omit<Apis.Users.User, "id">) => {
            const _user = this.util.user.toFirebaseUserDataAdapter({ id, ...userRecord }) as UpdateRequest | null

            if (!_user) return null

            return this.auth.updateUser(id, _user).then(async (user: UserRecord) => {
                return userRecord.rule ? await this.auth.setCustomUserClaims(user.uid, { rule: userRecord.rule }).then(async () => {
                    return this.util.user.toInternalUserAdapter({ ..._user, ...user, } as UserRecord)
                }) : this.util.user.toInternalUserAdapter({ ..._user, ...user } as UserRecord)
            })
        },

        updatePassword: (id: string, password: string) => this.auth.updateUser(id, { password })

        // return { get, getByUid, getByEmail, add, remove, update, updatePassword }
    }

    node = {
        register: async (nodeId: string, uuid: string) => {
            const credential = encryption().encrypt(`${useRuntimeConfig().SmarthomeCredential}|${new Date().getTime()}`, useRuntimeConfig().SmarthomeCredential)

            const token = credential ? encryption().encrypt(nodeId, credential) : null

            if (!(credential && token)) return null

            const nodeStorage: NodeStorageObject = {
                credential,
                token,
                name: nodeId,
                active: false,
                acceptedUsers: [uuid],
                items: []
            }

            return await this.storage.setItem(`node:${nodeId}.json`, nodeStorage).then(() => nodeStorage).catch(() => null)
        },

        activate: async (nodeId: string, token: string) => {
            const node = await this.util.node.use(nodeId)

            if (!node) return null

            const maybeNodeId = node.credential ? encryption().decrypt(token, node.credential) : undefined

            if (maybeNodeId !== nodeId) return null

            const nodeActivated: Server.Node.General & Server.Node.Items = Object.assign({ ...node, active: true, credential: undefined, token: undefined })

            return await this.storage.setItem(`node:${nodeId}.json`, node).then(() => nodeActivated).catch(() => null)
        },

        get: async (nodeId: string) => await this.util.node.use(nodeId),

        list: async (options?: { activeOnly?: boolean }) => {
            let nodes = await this.storage.getKeys("node")
                .then((keys) => keys.map((keyName) => keyName.replace("node:", "").replace(".json", "")))
                .catch(() => null)

            if (!nodes) return null

            if (options?.activeOnly) {
                nodes = await nodes.reduce<Promise<string[]>>(async (last, current) => {
                    const isActive = (await this.util.node.use(current))?.active === true
                    return isActive ? (await last).concat(current) : last
                }, Promise.resolve([]))
            }

            const withValue = async () => !nodes ? null : await nodes.reduce<Promise<NodeObject[]>>(async (last, current) => {
                const nodeId = current
                const node = {
                    ...(await this.util.node.use(nodeId)),
                    nodeId
                }

                return (await last).concat(node)
            }, Promise.resolve([]))

            return { nodes, withValue }
        },

        remove: async (nodeId: string) => this.storage.removeItem(`node:${nodeId}.json`).then(() => { return { nodeId } }).catch((e) => null),

        update: async (nodeId: string, update: { general?: Partial<Server.Node.General>, data?: Server.Node.Items }) => {
            let node = await this.util.node.use(nodeId)

            if (!node) return null

            let { general, data } = update
            Object.assign(node, general, data)

            return await this.storage.setItem(`node:${nodeId}.json`, node).then(() => node).catch(() => null)
        },

        exec: async (nodeId: string, exec: NodeExec) => {
            const requestId = nodeId ? (await (this.firestore.collection("request/lists/" + nodeId).add(exec))).id : null
            return requestId ? { requestId } : null
            // return requestId ? await this.taskStorage.setItem(`${nodeId}:${requestId}`, node).then(() => node).catch(() => null) : null
        },
    }

    app = {
        validApp: async (appId: string) => this.storage.hasItem(`apps:${appId}.json`).then(async validOnStorage => {
            if (validOnStorage) return true
            const appOnFirestoreSnapshot = await this.firestore.doc(`apps/${appId}`).get()
            if (appOnFirestoreSnapshot.exists) {
                console.log({ appdata: appOnFirestoreSnapshot.data() });

                return await this.storage.setItem(`apps:${appId}.json`, JSON.stringify(appOnFirestoreSnapshot.data() || {})).then(() => true).catch(() => false)
            }
            return false
        })
    }
}

export { SmarthomeStorage, SmarthomeStorage as default }