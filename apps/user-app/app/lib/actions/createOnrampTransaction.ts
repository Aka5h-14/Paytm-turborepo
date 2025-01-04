"use server";
import axios from "axios"
import prisma from "@repo/db/client";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { onRampInputs } from "@repo/zodtypes/types";

require('dotenv').config()

export async function createOnRampTransaction(provider: string, amount: number) {
    // Ideally the token should come from the banking provider (hdfc/axis)
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    const token = randomUUID();

    //zod

    try {
        await prisma.$transaction(async (tx) => {
            await tx.onRampTransaction.create({
                data: {
                    provider,
                    status: "Processing",
                    startTime: new Date(),
                    token: token,
                    userId: Number(session?.user?.id),
                    amount: amount * 100
                }
            });

            await tx.balance.update({
                where: { userId: Number(session.user.id) },
                data: { locked: { increment: amount * 100 } },
            });
        })
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    try {
        setTimeout(() => {
            axios.post("http://localhost:3003/bankWebhook", {

                token,
                user_identifier: Number(session?.user?.id),
                amount: amount * 100
    
            })
        },20000);
    }
    catch (e: any) {
        console.log(e);
        throw new Error(e.message);
    }

    return {
        message: "Add Money Done"
    }
}
