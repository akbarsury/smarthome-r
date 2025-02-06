import { z } from "zod"

const newNodeSchema = z.object({
    nodeId: z.string(),
    name: z.string()
})

type NewNode = z.infer<typeof newNodeSchema>

export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const newNode = (await readBody(event)) as NewNode
    if (!newNodeSchema.safeParse(newNode).success) return serverUtils.generateApiResponse(event, { statusCode: 400 })
    const node = await serverUtils.useSmarthome().storage.node.register(newNode.nodeId, session.user?.email!)
    return serverUtils.generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { nodeId: newNode.nodeId, credential: node.credential, token: node.token } : undefined
        })
})