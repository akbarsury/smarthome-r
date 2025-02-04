import { z } from "zod"

const newUserSchema = z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    rule: z.string()
})

type NewUser = z.infer<typeof newUserSchema>

export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const newUser = await readBody(event) as NewUser
    if (!newUserSchema.safeParse(newUser).success) return generateApiResponse(event, { statusCode: 400 })
    const user = await useSmarthome().storage.user().add(newUser)
    return generateApiResponse(event, {
        statusCode: user ? 200 : 500,
        data: user
    })
})