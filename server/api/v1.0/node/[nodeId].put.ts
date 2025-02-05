import { z } from "zod"

const editNodeSchema = z.object({
    name: z.string(),
    active: z.boolean(),
    acceptedUsers: z.string().array(),
}).partial()

export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const nodeId = getRouterParam(event, "nodeId")
    const editNode = await editNodeSchema.spa(await readBody(event))
    if (!nodeId && !editNode.success) return serverUtils.generateApiResponse(event, { statusCode: 400 })
    const node = nodeId ? await serverUtils.useSmarthome().storage.node().update(nodeId, { general: editNode.data }) : null
    return serverUtils.generateApiResponse(event, {
        statusCode: node ? 200 : 500,
        data: node ? { nodeId } : undefined
    })
})