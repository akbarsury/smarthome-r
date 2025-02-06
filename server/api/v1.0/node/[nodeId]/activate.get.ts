export default defineEventHandler(async (event) => {
    const token = serverUtils.useSmarthome().getBearer(event)
    if (!token) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const nodeId = getRouterParam(event, "nodeId")
    if (!nodeId) return serverUtils.generateApiResponse(event, {
        statusCode: 400, errors: {
            "nodeId": "nodeId is required"
        }
    })
    const node = await serverUtils.useSmarthome().storage.node.activate(nodeId, token)
    return serverUtils.generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { nodeId, ...node } : undefined
        })
})