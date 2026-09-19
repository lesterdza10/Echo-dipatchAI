import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const PUBLIC_ROUTES = ["/"];

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        /\.(jpg|jpeg|png|svg|webp|ico|css|js)$/i.test(pathname)
    ) {
        return NextResponse.next();
    }

    if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const role = session.user?.role;
    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/partner")) {
        if (pathname.startsWith("/partner/onboarding")) {
            return NextResponse.next();
        }

        if (role !== "partner") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    if (pathname.startsWith("/api")) {
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};