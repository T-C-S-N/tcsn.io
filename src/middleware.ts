import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';

export const config = {
   // matcher: ['/no'],
   matcher: [
      '/signin',
      '/signup',
      '/dashboard',
      '/dashboard/:id*',
      '/user/:id*'],
}

// check if user is authenticated and authorized
export async function middleware(req: NextRequest) {
   // 'secret' should be the same 'process.env.SECRET' use in NextAuth function
   const session = await getToken({ req, secret: process.env.SECRET as string });

   // if user authenticated and signin or signup page, redirect to dashboard
   if ((session && req.nextUrl.pathname === '/signin') || (session && req.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(process.env.WEBSITE_URL + '/dashboard' as string)
   }
   if ((!session && req.nextUrl.pathname === '/signin') || (!session && req.nextUrl.pathname === '/signup')) {
      return NextResponse.next()
   }
   // if user not authenticated and dashboard or user path, redirect to signin
   if ((!session && req.nextUrl.pathname.includes('/dashboard')) ||
      (!session && req.nextUrl.pathname.includes('/user'))) {
      return NextResponse.redirect(process.env.WEBSITE_URL + '/signin' as string)
   }

   return session ? NextResponse.next() : NextResponse.redirect(process.env.WEBSITE_URL as string)
}