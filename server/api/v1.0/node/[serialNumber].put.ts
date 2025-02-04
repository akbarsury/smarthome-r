import { z } from "zod"

const editNodeSchema = z.object({
    name: z.string(),
    active: z.boolean(),
    acceptedUsers: z.string().array(),
}).partial()

type EditNode = z.infer<typeof editNodeSchema>

export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const serialNumber = getRouterParam(event, "serialNumber")
    const editNode = await editNodeSchema.spa(await readBody(event))
    console.log({ editNode });
    if (!serialNumber && !editNode.success) return generateApiResponse(event, { statusCode: 400 })
    const node = serialNumber ? await useSmarthome().storage.nodes().update(serialNumber, { general: editNode.data }) : null
    return generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { serialNumber } : undefined
        })
})