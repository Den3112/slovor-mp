import { z } from 'zod'

export function validateData<T>(schema: z.Schema<T>, data: unknown): T {
    try {
        return schema.parse(data)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`)
            throw new Error(`Validation failed: ${messages.join('; ')}`)
        }
        throw error
    }
}

export function safeValidateData<T>(schema: z.Schema<T>, data: unknown): { data: T | null, error: string | null } {
    const result = schema.safeParse(data)
    if (result.success) {
        return { data: result.data, error: null }
    } else {
        const messages = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`)
        return { data: null, error: `Validation failed: ${messages.join('; ')}` }
    }
}
