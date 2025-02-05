export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const nodeId = getRouterParam(event, "nodeId")
    const node = await serverUtils.useSmarthome().storage.node().get(nodeId!)
    if (!node) return serverUtils.generateApiResponse(event, { statusCode: 204 })
    return serverUtils.generateApiResponse(event, {
        data: { name: node.name, items: node.items }
    })
})