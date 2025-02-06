export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const isManagement = getRequestHeader(event, 'referer')?.endsWith('/dashboard/management/nodes')
    const nodes = await serverUtils.useSmarthome().storage.node.list({ activeOnly: !isManagement }).then((nodes) => {
        return nodes ? nodes.withValue()
            .then((nodes) => nodes ? nodes.map((node) => {
                return isManagement ? { ...node, acceptedUsers: undefined, items: undefined } : { ...node, active: undefined, acceptedUsers: undefined, items: undefined }
            }) : null) : null
    })

    return serverUtils.generateApiResponse(event, {
        statusCode: 200,
        data: nodes
    })
})