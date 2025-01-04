import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.JWT_SECRET || "secret";
const Public_path = ['/_next', '/favicon.ico', '/api/auth']

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
        // user is logged in
        //dont know if verified
        if(!token.verified){
            if(pathname==("/signup/signupverify")){
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/signup/signupverify", req.url));
        }
        else{
            if(pathname=="/api/auth/signin" || pathname.startsWith("/signup") || pathname.startsWith("/forgotPass")){
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
