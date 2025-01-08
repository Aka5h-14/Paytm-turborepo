"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
const bcrypt = require("bcryptjs")


export async function signUpExternal({
    phone,
    password,
}: {
    phone: string;
    password: string;
}): Promise<{success:boolean , error?: any}> {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: false, error: "No Session" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser, balance] = await prisma.$transaction(async (tx: any) => {
            const newUser = await tx.user.update({
                where:{id: session.user.id},
                data: {
                    number: phone,
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