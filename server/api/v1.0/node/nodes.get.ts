export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const isManagement = getRequestHeader(event, 'referer')?.endsWith('/dashboard/management/nodes')
    const node = await useSmarthome().storage.nodes().get({ activeOnly: !isManagement })
    return generateApiResponse(event, {
        statusCode: 200,
        data: node
    })
})