require('dotenv').config()

import express from "express";
import db from "@repo/db/client";
import cron from "node-cron";

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express();
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Paytm Bank Webhook Handler");
})

app.post("/exp/bankWebhook", async (req, res) => {
    // zod done @ backend

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
        res.status(200).json({
            message: "Error while processing webhook"
        })
    }

})

// Route to send OTP email
app.post("/exp/sendEmail", async (req, res): Promise<any> => {
    const id: number = req.body.id;
    const otpLimit = 5;

    try {
        const user = await db.user.findFirst({
            where: { id: id },
        });

        if (!user) {
            return res.status(200).json({ success: false, msg: "User not found" });
        }

        // Count OTPs created in the last 24 hours
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of the day
        const otpCount = await db.otp.count({
            where: {
                userId: id,
                createdAt: { gte: today },
            },
        });

        if (otpCount >= otpLimit) {
            return res.status(200).json({ success: false, msg: "OTP limit exceeded for today" });
        }

        // Create a new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await db.otp.create({
            data: {
                userId: id,
                code: otp,
                createdAt: new Date(),
            },
        });

        const msg = {
            to: user.email,
            from: process.env.FROM,
            templateId: process.env.TEMPLATE_ID,
            dynamicTemplateData: {
                otp: otp,
                unsubscribe: "https://example.com/unsubscribe",
                unsubscribe_preferences: "https://example.com/preferences",
                support_link: "https://example.com/support",
            },
        };

        await sgMail.send(msg);
        return res.json({ success: true, msg: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return res.status(200).json({ success: false, msg: "Error sending OTP email" });
    }
});

// Route to validate OTP
app.post("/exp/validateOtp", async (req, res): Promise<any> => {
    const { otp, id }: { otp: string, id: number } = req.body;

    try {
        const user = await db.user.findFirst({
            where: { id: id },
            include: { otp: true },
        });

        if (!user) {
            return res.status(200).json({ success: false, msg: "User not found" });
        }

        // Find the most recent OTP
        const latestOtp = await db.otp.findFirst({
            where: { userId: id },
            orderBy: { createdAt: "desc" },
        });

        if (!latestOtp) {
            return res.status(200).json({ success: false, msg: "No OTP found" });
        }

        if (latestOtp.attempts <= 0) {
            return res.status(200).json({ success: false, msg: "OTP limit exceeded" });
        }

        await db.otp.update({
            where: {
                id: latestOtp.id
            },
            data: {
                attempts: {
                    decrement: 1
                }
            }
        })

        if (latestOtp.code === otp) {
            const updUser = await db.user.update({
                where: { id: id },
                data: { verified: true }
            })

            return res.status(200).json({ success: true, msg: "OTP verified successfully" });
        } else {
            return res.status(200).json({ success: false, msg: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error validating OTP:", error);
        return res.status(200).json({ success: false, msg: "Error validating OTP" });
    }
});

// Route to send OTP email for password reset
app.post("/exp/sendEmailPass", async (req, res): Promise<any> => {
    const email: string = req.body.email;
    const otpLimit = 5;

    try {
        const user = await db.user.findFirst({
            where: { email: email },
        });

        if (!user) {
            return res.status(200).json({ success: false, msg: "User not found" });
        }

        // Count OTPs created in the last 24 hours
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of the day
        const otpCount = await db.otp.count({
            where: {
                userId: user.id,
                createdAt: { gte: today },
            },
        });

        if (otpCount >= otpLimit) {
            return res.status(200).json({ success: false, msg: "OTP limit exceeded for today" });
        }

        // Create a new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await db.otp.create({
            data: {
                userId: user.id,
                code: otp,
                createdAt: new Date(),
            },
        });

        const msg = {
            to: email,
            from: process.env.FROM,
            templateId: process.env.TEMPLATE_ID,
            dynamicTemplateData: {
                otp: otp,
                unsubscribe: "https://example.com/unsubscribe",
                unsubscribe_preferences: "https://example.com/preferences",
                support_link: "https://example.com/support",
            },
        };

        await sgMail.send(msg);

        return res.json({ success: true, msg: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP email Pass:", error);
        return res.status(200).json({ success: false, msg: "Error sending OTP email" });
    }
});

// Route to validate OTP password
app.post("/exp/validateOtpPass", async (req, res): Promise<any> => {
    const { otp, email, password }: { otp: string, email: string, password: string } = req.body;

    try {
        const user = await db.user.findFirst({
            where: { email: email },
            include: { otp: true },
        });

        if (!user) {
            return res.status(200).json({ success: false, msg: "User not found" });
        }

        // Find the most recent OTP
        const latestOtp = await db.otp.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });


        if (!latestOtp) {
            return res.status(200).json({ success: false, msg: "No OTP found" });
        }

        if (latestOtp.attempts <= 0) {
            return res.status(200).json({ success: false, msg: "OTP limit exceeded" });
        }

        await db.otp.update({
            where: {
                id: latestOtp.id
            },
            data: {
                attempts: {
                    decrement: 1
                }
            }
        })

        if (latestOtp.code === otp) {
            await db.user.update({
                where: { id: user.id },
                data: { password: password },
            });

            return res.status(200).json({ success: true, msg: "Password changed successfully" });
        } else {
            return res.status(200).json({ success: false, msg: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error validating OTP:", error);
        return res.status(200).json({ success: false, msg: "Error changing Password" });
    }
});


cron.schedule("0 0 * * *", async () => { // run everyday at 12am
    try {
        const cutoffTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
        const deleted = await db.otp.deleteMany({
            where: {
                createdAt: {
                    lt: cutoffTime, // Less than the cutoff time
                },
            },
        });
        console.log(`Deleted ${deleted.count} expired OTP(s)`);
    } catch (error) {
        console.error("Error during OTP cleanup:", error);
    }
});

app.listen(process.env.PORT || 3003, () => {
    console.log("Server is running on port 3003");
});

module.exports = app;
