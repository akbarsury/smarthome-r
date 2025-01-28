type NewUser = {
    email?: string
    password?: string
    name?: string
}

export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return setResponseStatus(event, 401, "Unauthorized")
    const { email, password, name } = await readBody(event) as NewUser
    if (!(email && password && name)) return setResponseStatus(event, 400, "Bad Request")
    const user = await useSmarthome().storage.user().add({ email, password, name })
    return generateApiResponse(event, {
        message: user ? "Success create user" : "Failed create user",
        data: [user].map<Apis.Users.User>((user) => {
            return {
                id: user.uid || "NULL",
                email: user.email || "NULL",
                name: user.displayName || "NULL"
            }
        })[0]
    })
})