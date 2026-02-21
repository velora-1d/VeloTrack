import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
    const isProtectedRoute =
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/leads') ||
        request.nextUrl.pathname.startsWith('/mitra') ||
        request.nextUrl.pathname.startsWith('/projects') ||
        request.nextUrl.pathname.startsWith('/finance') ||
        request.nextUrl.pathname.startsWith('/profit') ||
        request.nextUrl.pathname.startsWith('/reports') ||
        request.nextUrl.pathname.startsWith('/settings')

    // ============================================
    // Logic Rewrite URL (URL tetap track.ve-lora.my.id)
    // ============================================

    const path = request.nextUrl.pathname;

    // Jika tidak ada user dan mencoba akses root (/) -> Rewrite ke /login (URL tetap /)
    if (!user && path === '/') {
        return NextResponse.rewrite(new URL('/login', request.url));
    }

    // Jika tidak ada user dan mencoba akses route rahasia -> Redirect ke root (yang mana adalah form login)
    if (!user && isProtectedRoute && path !== '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Jika ada user dan akses root (/) -> Rewrite ke /dashboard (URL tetap /)
    if (user && path === '/') {
        return NextResponse.rewrite(new URL('/dashboard', request.url));
    }

    // Jika ada user dan mencoba akses halaman /login langsung -> Redirect ke root (dashboard)
    if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return supabaseResponse
}
