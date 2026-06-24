// NextAuth API route — handles sign-in, session, and callback requests via GET/POST.
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
