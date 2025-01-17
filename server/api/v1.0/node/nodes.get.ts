export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return setResponseStatus(event, 401, "Unauthorized")
    const isManagement = getRequestHeader(event, 'referer')?.endsWith('/dashboard/management/nodes')
    const node = session ?
        await useSmarthome().storage.nodes().get({ activeOnly: !isManagement }) :
        undefined
    return node ?
        generateApiResponse(200,
            {
                data: node
            })
        : setResponseStatus(event, 400, 'Bad request')
})