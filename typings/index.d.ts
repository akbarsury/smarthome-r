namespace apis {
    namespace users {
        interface IUser {
            id: string,
            email: string | null,
            name: string | null
        }
    }
}