// "use server";

// const bcrypt = require("bcryptjs")
// import prisma from "@repo/db/client"; 
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest , res: NextResponse<JSON>) {
//     const body:{name: string; phone: string; email: string; password: string} = await req.json();
    
//     //zod validation
//   if (!body.name || !body.phone || !body.email || !body.password) {
//     return NextResponse.json({success:false, error: "fields missing",})
//   }

//   try {
//     const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

//     if (existingUser) {
//         return NextResponse.json({success:false, error: "user already present",})
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(body.password, 10);

//     // Create a new user
//     const newUser = await prisma.user.create({
//       data: {
//         name: body.name,
//         number: body.phone,
//         email: body.email,
//         password: hashedPassword,
//       },
//     });

//     return NextResponse.json({ success: true, user: newUser });
//   } catch (error) {
//     return NextResponse.json({success:false, error: error,})
//   }
// }
