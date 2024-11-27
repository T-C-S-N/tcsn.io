import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';

export const config = {
   // matcher: ['/no'],
   matcher: [
      //'/auth',
      //'/dashboard',
      //'/dashboard/:id*',
      //'/user/:id*'
],
}

// check if user is authenticated and authorized
export async function middleware(req: NextRequest) {
   // 'secret' should be the same 'process.env.SECRET' use in NextAuth function
   const session = await getToken({ req, secret: process.env.SECRET as string });

   // if user authenticated and auth page, redirect to dashboard
   if (session && req.nextUrl.pathname === '/auth') {
      return NextResponse.redirect(process.env.WEBSITE_URL + '/dashboard' as string)
   }
   if (!session && req.nextUrl.pathname === '/auth') {
      return NextResponse.next()
   }
   // if user not authenticated and dashboard or user path, redirect to auth
   if ((!session && req.nextUrl.pathname.includes('/dashboard')) ||
      (!session && req.nextUrl.pathname.includes('/user'))) {
      return NextResponse.redirect(process.env.WEBSITE_URL + '/auth' as string)
   }

   return session ? NextResponse.next() : NextResponse.redirect(process.env.WEBSITE_URL as string)
}