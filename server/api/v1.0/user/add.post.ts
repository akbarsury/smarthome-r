import { z } from "zod"

const newUserSchema = z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    rule: z.string()
})

type NewUser = z.infer<typeof newUserSchema>

export default defineEventHandler(async (event) => {
    const { session } = await serverUtils.useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return serverUtils.generateApiResponse(event, { statusCode: 401 })
    const newUser = await readBody(event) as NewUser
    if (!newUserSchema.safeParse(newUser).success) return serverUtils.generateApiResponse(event, { statusCode: 400 })
    const user = await serverUtils.useSmarthome().storage.user.add(newUser)
    return serverUtils.generateApiResponse(event, {
        statusCode: user ? 200 : 500,
        data: user
    })
})