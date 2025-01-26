import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
    email: z.string()
})

export const SignInSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
    email: z.string()
})
export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})