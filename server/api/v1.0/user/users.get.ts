export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return setResponseStatus(event, 401, "Unauthorized")
    const users = await useSmarthome().storage.user().get()
    return generateApiResponse(200, {
        message: users.users.length !== 0 ? "Data users exist" : "Data users empty",
        data: users.users.map((user) => {
            return {
                id: user.uid,
                email: user.email || null,
                name: user.displayName || null
            }
        })
    })
})