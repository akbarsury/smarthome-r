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

type ValidationSchemaKey = keyof (typeof validationSchema)
type ValidationSchemaPathKey<T extends ValidationSchemaKey | unknown> = T extends ValidationSchemaKey ? keyof (typeof validationSchema[T]) : unknown

type FieldVal<TVal extends string | number | boolean = string, TAttr extends object = {}> = { val: TVal, attr: TAttr }

class CreateForm<
    T extends ValidationSchemaKey,
    _T = T extends ValidationSchemaKey ? T : unknown,
    P = ValidationSchemaPathKey<_T extends ValidationSchemaKey ? T : unknown>
> {

    constructor(name: T) {
        this.name = name
        this.form = useForm({ validationSchema: toTypedSchema(z.object(validationSchema[name])) })
        this.keys = Object.keys(validationSchema[name]) as P[]
        Object.assign(this.fields, Object.fromEntries((this.keys).map((key) => {
            let [x, y] = this.form.defineField(ref(key))
            return [key, { val: x, attr: y }]
        })))
    }

    // property
    private name: T | null = null;
    form: ReturnType<typeof useForm>;
    keys: P[] | null = null;
    fields: { [fieldName: string]: FieldVal } = reactive({});

    // method
    useField = <T extends P>(field: T) => this.form.defineField(ref(field))

}

export const useManagementForm = defineStore('management-form', () => {
    const form = <FormName extends ValidationSchemaKey>(name: FormName) => new CreateForm(name)

    return {
        form
    }
});