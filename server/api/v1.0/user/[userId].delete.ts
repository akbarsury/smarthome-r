export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return setResponseStatus(event, 401, "Unauthorized")
    const id = getRouterParam(event, "userId")
    if (!id) return setResponseStatus(event, 400, "Bad Request")
    const user = await serverUtils.useSmarthome().storage.user.remove(id)
    return serverUtils.generateApiResponse(event, {
        message: user ? "Success delete user" : "Failed delete user",
        data: { userId: user?.id }
    })
})