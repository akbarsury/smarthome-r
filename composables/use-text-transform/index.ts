import {
    capitalize,
    hash,
    toCamelCase,
    toKebabCase,
    toPascalCase,
    toSnakeCase,
} from 'string-transform';

type TransformTarget = "capitalize" | "hash" | "toCamelCase" | "toKebabCase" | "toPascalCase" | "toSnakeCase"

const useTextTransform = (transformTarget: TransformTarget, string: string) => {
    const transformator = {
        "capitalize": capitalize,
        "hash": hash,
        "toCamelCase": toCamelCase,
        "toKebabCase": toKebabCase,
        "toPascalCase": toPascalCase,
        "toSnakeCase": toSnakeCase
    }
    return transformator[transformTarget](string)
}

export { useTextTransform, useTextTransform as default }