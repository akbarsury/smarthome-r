export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    const users = session ? await useSmarthome().storage.user().get() : undefined
    return generateApiResponse(event, {
        statusCode: session ? 200 : 401,
        data: users ? users.users.map<Apis.Users.User>((user) => {
            return {
                id: user.uid || "NULL",
                email: user.email || "NULL",
                name: user.displayName || "NULL"
            }
        }) : undefined
    })
})