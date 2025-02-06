namespace Apis {
    namespace Users {
        type User = {
            id: string,
            email: string,
            name: string,
            rule: string
        }
        type NewUser = Apis.Users.user & {
            password: string,
        }
    }
    namespace Nodes {
        type Node = {
            nodeId: string
            name: string
            active: boolean
        }
        type Item = {
            name: string,
            type: "switch" | "push",
            icon: string,
            current?: "on" | "off"
        } | null
        type NewNode = {
            nodeId: string
        }
    }
    namespace Session {
        type Session = {
            user: Apis.Session.User,
            expires: Apis.Session.Expires
        }
        type User = {
            id: string,
            email: string,
            username: string,
            name: string
        }
        type Expires = string
    }
    namespace WebSocket {
        type MessagesKeys = "bind"
        type Messages<T extends keyof MessagesKeys = keyof MessagesKeys, S = any> = Record<T, S>
    }
}