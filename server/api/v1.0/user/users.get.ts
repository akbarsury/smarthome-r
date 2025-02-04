export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const users = await useSmarthome().storage.user().get()
    return generateApiResponse(event, {
        statusCode: 200,
        data: users
    })
})