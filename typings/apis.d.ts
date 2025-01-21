namespace Apis {
    namespace Users {
        type User = {
            id: string,
            email: string,
            name: string
        }
        type NewUser = {
            email: string,
            name: string,
            password: string,
        }
    }
    namespace Nodes {
        type Node = {
            serialNumber: string
            name: string
            active: boolean
        }
        type Switch = {
            name: string
            type: "switch" | "push"
            icon: string
        }
        type NewNode = {
            serialNumber: string
        }
    }
}