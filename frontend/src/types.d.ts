declare module "next-auth" {
    interface User {
        id: string;
        role: string;
        name: string;
        email: string;
    }

    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}

export {};