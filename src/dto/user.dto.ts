import { z } from 'zod'

export const userSignUpSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    password: z.string().min(6).max(50),
})

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(50),
})

export const userUpdateSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
})

export interface userPayload {
    _id: string
    email: string
    verified: boolean
}
