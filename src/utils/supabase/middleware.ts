import { PAGES, PERMISSIONS, ROLE } from "@/config";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [PAGES.SIGN_UP, PAGES.LOGIN, PAGES.RESET_PASSWORD, PAGES.FORGOT_PASSWORD];

const PROTECTED_ROUTES = [PAGES.SELECT_ROLE, PAGES.ADMIN_BATTLERS, PAGES.ADMIN_USER_LIST];

const ACCESS_CONTROL = {
  [PAGES.ADMIN_USER_LIST]: {
    roles: [ROLE.ADMIN],
    permissions: [],
  },
  [PAGES.ADMIN_BATTLERS]: {
    roles: [ROLE.ADMIN],
    permissions: [PERMISSIONS.COMMUNITY_MANAGER],
  },
};

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    const pathname = request.nextUrl.pathname;
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    if (PUBLIC_ROUTES.includes(request.nextUrl.pathname) && !user.error) {
      return NextResponse.redirect(new URL(PAGES.HOME, request.url));
    }

    if (PROTECTED_ROUTES.includes(request.nextUrl.pathname) && user.error) {
      return NextResponse.redirect(new URL(PAGES.LOGIN, request.url));
    }

    // If user is logged in but don't have role setup, redirect to role setup page
    if (
      user.data.user &&
      !user.data.user.user_metadata.role &&
      request.nextUrl.pathname !== PAGES.SELECT_ROLE
    ) {
      return NextResponse.redirect(new URL(PAGES.SELECT_ROLE, request.url));
    }

    // If role selected and goes to select role page, redirect to home
    if (
      user.data.user &&
      user.data.user.user_metadata.role &&
      request.nextUrl.pathname === PAGES.SELECT_ROLE
    ) {
      return NextResponse.redirect(new URL(PAGES.HOME, request.url));
    }
    // Role base access control
    const rbacAccess = ACCESS_CONTROL[pathname];
    if (user.data.user && rbacAccess) {
      const hasRequiredRole =
        !rbacAccess.roles?.length || rbacAccess.roles.includes(user.data.user.user_metadata.role);
      const hasRequiredPermission =
        !rbacAccess.permissions?.length ||
        rbacAccess.permissions.includes(user.data.user.user_metadata.permission);

      if (!hasRequiredRole && !hasRequiredPermission) {
        return NextResponse.redirect(new URL(PAGES.HOME, request.url));
      }
    }

    return response;
  } catch (e) {
    console.error(e);
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
