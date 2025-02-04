
import { defineStore } from 'pinia';
import z from 'zod';

const userRule = ["admin", "user"] as const
const nodeItemType = ["switch", "push"] as const

export const validationSchema = {
    addUser: {
        email: z.string().email({ message: "email tidak valid" }).nonempty("email tidak boleh kosong").default(""),
        name: z.string().nonempty("nama tidak boleh kosong").default(""),
        password: z.string().nonempty("password tidak boleh kosong").min(8, "password minimal berisi 8 karakter").max(20, "password maksimal berisi 20 karakter").default(""),
        rule: z.enum(userRule, {
            errorMap: () => ({ message: "rule tidak valid" })
        }).default("user")
    },
    editUser: {
        email: z.string().email({ message: "email tidak valid" }).nonempty("email tidak boleh kosong").default(""),
        name: z.string().nonempty("nama tidak boleh kosong").default(""),
        rule: z.enum(userRule, {
            errorMap: () => ({ message: "rule tidak valid" })
        }).default("user")
    },
    changeUserPassword: {
        email: z.string().email({ message: "email tidak valid" }).nonempty("email tidak boleh kosong").default(""),
        password: z.string().nonempty("password tidak boleh kosong").default(""),
        newPassword: z.string().nonempty("password baru tidak boleh kosong").min(8, "password baru minimal berisi 8 karakter").max(20, "password baru maksimal berisi 20 karakter").default(""),
    },
    addNode: {
        serialNumber: z.string().nonempty("serial number tidak boleh kosong").default(""),
        name: z.string().nonempty("nama tidak boleh kosong").default("")
    },
    editNode: {
        serialNumber: z.string().nonempty("serial number tidak boleh kosong").default(""),
        name: z.string().nonempty("nama tidak boleh kosong").default(""),
        active: z.boolean({
            errorMap: () => ({ message: "active status tidak valid" })
        }).default(false)
    },
    addNodeItems: {
        serialNumber: z.string().nonempty("serial number tidak boleh kosong").default(""),
        items: z.object({
            ioPort: z.coerce.number().min(1).max(8),
            name: z.string().nonempty().default(""),
            type: z.enum(nodeItemType).default("switch"),
            icon: z.string().nonempty().default("hugeicons:lamp-01"),
        }).array()
    },
    editNodeItems: {
        serialNumber: z.string().nonempty("serial number tidak boleh kosong"),
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
    const addNode = () => new UseForm("add user", validationSchema.addNode)
    const editNode = () => new UseForm("edit user", validationSchema.editNode)

    return {
        addUser,
        editUser,
        changeUserPassword,
        addNode,
        editNode,
    }
});


