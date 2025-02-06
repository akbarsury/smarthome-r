export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const users = await serverUtils.useSmarthome().storage.user.get()
    return serverUtils.generateApiResponse(event, {
        statusCode: 200,
        data: users
    })
})