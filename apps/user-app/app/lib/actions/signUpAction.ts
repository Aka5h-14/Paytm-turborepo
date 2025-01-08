"use server";

import prisma from "@repo/db/client";
const bcrypt = require("bcryptjs")


export async function signUpAction({
    name,
    phone,
    email,
    password,
}: {
    name: string;
    phone: string;
    email: string;
    password: string;
}): Promise<{success:boolean , error?: any}> {

    try {
        const existingUser = await prisma.user.findUnique({
            where: { number: phone },
        });

        if (existingUser) {
            return { success: false, error: "user already present" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser, balance] = await prisma.$transaction(async (tx: any) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    number: phone,
                    email,
                    password: hashedPassword,
                },
            });

            const balance = await tx.balance.create({
                data: {
                    userId: newUser.id,
                    amount: 0,
                    locked: 0,
                },
            });

            return [newUser, balance];
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: error };
    }
}