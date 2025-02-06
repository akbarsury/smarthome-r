import { z } from "zod"

const executionNodeSchema = z.object({
    itemIndex: z.number(),
    executionType: z.enum(["switch", "push", "restart"]),
    clickTime: z.number()
})

export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const nodeId = getRouterParam(event, "nodeId")
    const executionNode = await executionNodeSchema.spa(await readBody(event))
    if (!nodeId && !executionNode.success) return serverUtils.generateApiResponse(event, { statusCode: 400 })
    const node = nodeId && executionNode.data ? await serverUtils.useSmarthome().storage.node.exec(nodeId, executionNode.data) : null
    return serverUtils.generateApiResponse(event, {
        statusCode: node ? 200 : 500,
        data: node
    })
})