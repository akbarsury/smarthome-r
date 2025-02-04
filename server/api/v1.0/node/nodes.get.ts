export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const isManagement = getRequestHeader(event, 'referer')?.endsWith('/dashboard/management/nodes')
    const nodes = (await (await useSmarthome().storage.nodes().get({ activeOnly: !isManagement })).withValue()).map((node) => {
        return isManagement ? { ...node, acceptedUsers: undefined, items: undefined } : { ...node, active: undefined, acceptedUsers: undefined, items: undefined }
    })

    return generateApiResponse(event, {
        statusCode: 200,
        data: nodes
    })
})