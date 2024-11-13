import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const adminRoute = ['/admin(.*)', '/list/students', '/list/classes'];
const studentRoute = ['/student(.*)', '/list/students'];
const protectedRoute = ['/admin(.*)', '/student(.*)', '/list(.*)'];

const isAdminRoute = createRouteMatcher(adminRoute);
const isStudentRoute = createRouteMatcher(studentRoute);
const isProtectedRoute = createRouteMatcher(protectedRoute);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();

    if (!userId && isProtectedRoute(req)) {
      return redirectToSignIn();
    }
    // if (isAdminRoute(req)) {
    //   console.log('abc');
    //   await auth.protect((has) => {
    //     return has({ role: 'admin' });
    //   });
    // }
    // if (isStudentRoute(req)) {
    //   await auth.protect((has) => {
    //     return has({ role: 'student' });
    //   });
    // }
  }
  // {
  //   debug: true,
  // }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
