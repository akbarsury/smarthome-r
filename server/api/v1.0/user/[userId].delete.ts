export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return setResponseStatus(event, 401, "Unauthorized")
    const id = getRouterParam(event, "userId")
    if (!id) return setResponseStatus(event, 400, "Bad Request")
    const user = await useSmarthome().storage.user().remove(id)
    return generateApiResponse(200, {
        message: user ? "Success delete user" : "Failed delete user",
        data: { userId: user?.id }
    })
})