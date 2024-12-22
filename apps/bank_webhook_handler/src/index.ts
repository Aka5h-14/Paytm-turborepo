require('dotenv').config()

import express from "express";
import db from "@repo/db/client";

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express();
app.use(express.json())

app.post("/bankWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount),
                    },
                    locked: {
                        decrement: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            }),
        ]);

        res.json({
            message: "Captured, Money transferred"
        })
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.post("/sendEmail", async (req, res) => {
    const userInfo: {
        email: string;
    } = {
        email: req.body.email
    };

    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await db.user.findFirst({
        where: { email : userInfo.email }
    })
    if (user) {
        const upsertOtp = await db.otp.upsert({
            where: {
                userId: Number(user.id),
            },
            update: {
                code: otp.toString(),
                createdAt: new Date(),
            },
            create: {
                userId: Number(user.id),
                code: otp.toString(),
                createdAt: new Date()
            },
        })
    }

    const msg = {
        to: userInfo.email,
        from: process.env.FROM,
        templateId: process.env.TEMPLATE_ID,
        dynamicTemplateData: {
            otp: otp,
            unsubscribe: "https://example.com/unsubscribe",
            unsubscribe_preferences: "https://example.com/preferences",
            support_link: "https://example.com/support"
        },
    };

    try {
        await sgMail.send(msg);
        res.json({ success: true, msg: "Template email sent successfully" })
    } catch (error) {
        res.json({ success: false, msg: 'Error sending template email:' })
    }
})

app.post("/validateOtp", async (req, res)=>{
    const otp : string = req.body.otp;
    const userEmail = req.body.email;

    try{
        const user = await db.user.findFirst({ where: { email: userEmail }, include:{otp: true} });
        
        const dbOtp = user?.otp?.code;

        if (dbOtp === otp) {
            const updated = await db.user.update({where: {id: user?.id}, data: { verified: true }});
            res.status(200).json({success: true})
        }
    } catch(e){
        res.json({success: false});
    }
})

app.listen(3003, () => {
    console.log("Server is running on port 3003");
});
