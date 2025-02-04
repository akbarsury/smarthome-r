import { z } from "zod"

const newNodeSchema = z.object({
    serialNumber: z.string(),
    name: z.string()
})

type NewNode = z.infer<typeof newNodeSchema>

export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const newNode = (await readBody(event)) as NewNode
    if (!newNodeSchema.safeParse(newNode).success) return generateApiResponse(event, { statusCode: 400 })
    const node = await useSmarthome().storage.nodes().register(newNode.serialNumber, session.user?.email!)
    return generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { serialNumber: newNode.serialNumber, credential: node.credential, token: node.token } : undefined
        })
})