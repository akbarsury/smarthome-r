import { useForm as veeUseForm, type BaseFieldProps, type GenericObject, type Path, type PathValue } from 'vee-validate'
import { computed, ref, type UnwrapNestedRefs } from 'vue';
import z, { type ZodType } from 'zod';

export type FormsSchema = Record<string, FormSchema>
type FormSchema = z.ZodRawShape

type FieldObj<
    T,
    TVal extends globalThis.Ref<T> = globalThis.Ref<T>,
    TBind extends ManagedFormFieldDefaultProps["bind"] = ManagedFormFieldDefaultProps["bind"],
    TProps extends ManagedFormFieldDefaultProps["props"] = ManagedFormFieldDefaultProps["props"],
    TErr extends globalThis.ComputedRef<string[]> = globalThis.ComputedRef<string[]>
> = {
    val: TVal,
    bind: TBind,
    props: TProps,
    errors: TErr
}

class ManagedFormFieldDefaultProps<T extends (BaseFieldProps & GenericObject) = BaseFieldProps & GenericObject> {
    constructor(props: T) {
        this.props = {
            ...props,
            ...this.props
        }
    }

    private _focus: globalThis.Ref<boolean> = ref(false)

    props = {
        focus: computed(() => this._focus.value)
    }

    bind = {
        onInput: (cb: void) => {
            cb
            this._focus.value = true
        },
        onBlur: (cb: void) => {
            cb
            this._focus.value = false
        },
        onChange: (cb: void) => {
            cb
        }
    }
}

export class ManagedForm<
    S extends FormsSchema,
    T extends keyof S
> {
    constructor(private schema: S) {
        this.keys = Object.keys(schema) as T[]
        this.forms = Object.assign(Object.fromEntries(
            (this.keys).map((key) => [key, veeUseForm({ validationSchema: toTypedSchema(z.object(this.schema[key])) })])
        ))
    }

    keys: T[] = []
    forms: Record<T, UseForm>
    // method
}

export class UseForm<
    S extends FormSchema = FormSchema,
    KeyOfS extends keyof S | string = S extends FormSchema ? keyof S : string,
    G extends GenericObject = Record<keyof S, z.infer<S[keyof S]>>,
    Fields extends object = Record<KeyOfS, FieldObj<G[keyof G]>>
> {
    constructor(private name: string, schema: S, anyOptions?: Omit<Parameters<typeof useForm>, "name" | "validationSchema">) {
        this.fieldKeys = Object.keys(schema) as KeyOfS[]
        this.form = useForm<G>({ name, validationSchema: toTypedSchema(z.object(schema)), ...anyOptions })
        Object.assign(this.fields, Object.fromEntries((this.fieldKeys).map((key) => {
            let [val, attr] = this.useField(key) as [globalThis.Ref<PathValue<G, G[keyof G]>, PathValue<G, G[keyof G]>>, globalThis.Ref<BaseFieldProps & G, BaseFieldProps & G>]
            let errors = computed(() => (this.form as ReturnType<typeof useForm<G>>).errorBag.value[key as unknown as Path<G>])
            return [key, {
                val,
                ...(new ManagedFormFieldDefaultProps({ ...toValue(attr) })),
                errors
            }]
        })))
    }

    // property
    private fieldKeys: KeyOfS[]
    form: Omit<ReturnType<typeof useForm<G>>, "meta" | "values" | "errors" | "errorBag" | "controlledValues">
    meta = computed(() => (this.form as ReturnType<typeof useForm<G>>).meta.value)
    values = computed(() => (this.form as ReturnType<typeof useForm<G>>).values)
    isValid = computed(() => this.meta.value.valid)
    fields: UnwrapNestedRefs<Fields> = reactive({} as Fields)

    // method
    useField = <T extends KeyOfS>(field: T) => this.form.defineField(ref(field))

}