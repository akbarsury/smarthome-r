namespace Server {
    namespace Node {
        interface PreActivate {
            credential?: string
            token?: string
        }
        interface General {
            name: string
            active?: boolean
            acceptedUsers?: string[],
        }
        interface SerialNumber {
            serialNumber: string
        }
        interface Items {
            items: ({
                name: string,
                type: "switch" | "push",
                icon: string,
                current?: "on" | "off"
            } | null)[]
        }
    }
}