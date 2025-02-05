export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const nodeId = getRouterParam(event, "nodeId")
    if (!nodeId) return serverUtils.generateApiResponse(event, { statusCode: 400 })
    const node = await serverUtils.useSmarthome().storage.node().remove(nodeId)
    return serverUtils.generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { nodeId } : undefined
        })
})