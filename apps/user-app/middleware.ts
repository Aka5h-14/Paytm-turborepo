import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.JWT_SECRET || "secret";
const Public_path = ['/_next', '/favicon.ico', '/api/auth' , '/google.svg']

export default async function middleware(req: NextRequest) {

    const { pathname } = req.nextUrl;
    if (Public_path.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // console.log("\n" + pathname );

    const token = await getToken({ req, secret: SECRET });

    if(!token){
        // new user
        if(pathname=="/api/auth/signin" || pathname=="/signup" || pathname=="/forgotPass"){
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    if(token){
        if(!token.number || token.number==""){
            if(pathname=="/signup/signupGoogle"){
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/signup/signupGoogle", req.url));
        }
        //not verified
        if(!token.verified){
            if(pathname==("/signup/signupverify")){
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/signup/signupverify", req.url));
        }
        // verified
        else{
            if(pathname=="/api/auth/signin" || pathname=="/signup" || pathname=="/signup/signupverify" || pathname.startsWith("/forgotPass")){
                return NextResponse.redirect(new URL("/", req.url));
            }
            return NextResponse.next();
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};
