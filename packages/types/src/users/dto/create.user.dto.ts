import { z } from "zod";
export const UserSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
        message: "asfafsasffsa"
    }),
    title: z.string({
        required_error: "title is required",
        invalid_type_error: "title must be a string",
        message: "asfafsasffsa"
    }),
    email: z.string({
        required_error: "email is required",
        invalid_type_error: "email must be a string",
        message: "asfafsasffsa"
    }),
    phone: z.string({
        required_error: "phone is required",
        invalid_type_error: "phone must be a string",
        message: "asfafsasffsa"
    }),
    country: z.string({
        required_error: "country is required",
        invalid_type_error: "country must be a string",
        message: "asfafsasffsa"
    }),
    age: z.number({
        required_error: "age is required",
        invalid_type_error: "age must be a number",
        message: "asfafsasffsa"
    })

})

export type UserDTO = z.infer<typeof UserSchema>;