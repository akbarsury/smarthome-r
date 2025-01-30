
import { defineStore } from 'pinia';
import z from 'zod';

const userRule = ["admin", "user"] as const
const nodeItemType = ["switch", "push"] as const

export const validationSchema = {
    addUser: {
        email: z.string().email().nonempty().default(""),
        name: z.string().nonempty().default(""),
        password: z.string().min(8).max(20).default(""),
        rule: z.enum(userRule).default("user")
    },
    editUser: {
        email: z.string().email().nonempty().default(""),
        name: z.string().nonempty().default(""),
        rule: z.enum(userRule).default("user")
    },
    changeUserPassword: {
        email: z.string().email().nonempty().default(""),
        password: z.string().nonempty().default(""),
        newPassword: z.string().nonempty().min(8).max(20).default(""),
    },
    addNode: {
        serialNumber: z.string().nonempty().default(""),
        name: z.string().nonempty().default("")
    },
    editNode: {
        serialNumber: z.string().nonempty().default(""),
        name: z.string().nonempty().default(""),
        activeStatus: z.boolean().default(false)
    },
    addNodeItems: {
        serialNumber: z.string().nonempty().default(""),
        items: z.object({
            ioPort: z.coerce.number().min(1).max(8),
            name: z.string().nonempty().default(""),
            type: z.enum(nodeItemType).default("switch"),
            icon: z.string().nonempty().default("hugeicons:lamp-01"),
        }).array()
    },
    editNodeItems: {
        serialNumber: z.string().nonempty(),
        items: z.object({
            ioPort: z.coerce.number().min(1).max(8),
            name: z.string().nonempty().default(""),
            type: z.enum(nodeItemType).default("switch"),
            icon: z.string().nonempty().default("hugeicons:lamp-01"),
        }).array()
    },
}

export const useManagementForm = defineStore('management-form', () => {
    const addUser = () => new UseForm("add user", validationSchema.addUser)
    const editUser = () => new UseForm("edit user", validationSchema.editUser)
    const changeUserPassword = () => new UseForm("change user password", validationSchema.changeUserPassword)

    return {
        addUser,
        editUser,
        changeUserPassword
    }
});


