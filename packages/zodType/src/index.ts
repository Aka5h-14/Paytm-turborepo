import { z } from "zod";

export const signInInputs= z.object({
    phoneNum: z.string().min(5, { message: "phone number must be 5 or more characters long" }),
    password: z.string(),
})
export type SignInInputsType = z.infer<typeof signInInputs>;

export const signUpInputs = z.object({
    name: z.string().max(20,{ message:"name must be 20 or less characters long"}),
    phone: z.string().min(5,{ message: "phone number must be 5 or more characters long" }),
    email: z.string().email(),
    password: z.string(),
})
export type SignUpInputsType = z.infer<typeof signUpInputs>;

export const p2pInputs = z.object({
    to: z.string().min(5,{ message: "phone number must be 5 or more characters long" }) ,
    amount: z.number().positive({message:"Amount must be positive"}),
})
export type P2PInputsType = z.infer<typeof p2pInputs>;

export const onRampInputs = z.object({
    provider: z.string(),
    amount: z.number().positive({message:"Amount must be positive"}),
})
export type OnRampInputsType = z.infer<typeof onRampInputs>;
