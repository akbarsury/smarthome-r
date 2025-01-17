namespace apis {
    namespace users {
        interface IUser {
            id: string,
            email: string | null,
            name: string | null
        }
    }
}

namespace NodeObject {
    interface PreActivate {
        credential?: string
        token?: string
    }
    interface General {
        name: string
        active: boolean
        acceptedUsers?: string[],
    }
    interface SerialNumber {
        serialNumber: string
    }
    interface Data {
        data?: []
    }
}