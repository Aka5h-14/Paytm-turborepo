import { z } from "zod";

export const signInInputs = z.object({
  phoneNum: z
    .string()
    .min(5, { message: "Phone number must be 5 or more numbers long" })
    .max(10, { message: "Phone number must be less than 11 numbers long" }),
  password: z
  .string()
  .min(8, { message: "Password must be 8 or more characters long" }),
});
export type SignInInputsType = z.infer<typeof signInInputs>;

export const signUpInputs = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be 3 or more characters long" })
    .max(20, { message: "Name must be 20 or less characters long" }),
  phone: z
    .string()
    .min(5, { message: "Phone number must be 5 or more numbers long" })
    .max(10, { message: "Phone number must be less than 11 numbers long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
  .string()
  .min(8, { message: "Password must be 8 or more characters long" }),
});
export type SignUpInputsType = z.infer<typeof signUpInputs>;

export const p2pInputs = z.object({
  to: z
    .string()
    .min(5, { message: "Phone number must be 5 or more numbers long" })
    .max(10, { message: "Phone number must be less than 11 numbers long" }),
  amount: z
    .number()
    .positive({ message: "Amount must be positive" })
    .int({ message: "Amount must be an integer" }),
});
export type P2PInputsType = z.infer<typeof p2pInputs>;

export const onRampInputs = z.object({
  provider: z.string(),
  amount: z
    .number()
    .positive({ message: "Amount must be positive" })
    .int({ message: "Amount must be an integer" }),
});
export type OnRampInputsType = z.infer<typeof onRampInputs>;
