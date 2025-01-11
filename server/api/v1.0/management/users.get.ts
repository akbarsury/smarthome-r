export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return setResponseStatus(event, 401, "Unauthorized")
    else {
        const users = await useSmarthome().storage.user().get()
        return users.users.length !== 0 ? {
            message: "Data users exist",
            data: {
                users: users.users.map((user) => {
                    return {
                        id: user.uid,
                        email: user.email || null,
                        name: user.displayName || null
                    }
                })
            }
        } : {
            message: "Data users empty",
            data: { users: null }
        }
    }
})