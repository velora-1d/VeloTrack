'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export async function loginUser(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'Invalid email or password' }
    }

    // Optionally verify user exists in Prisma DB as well
    const dbUser = await prisma.user.findUnique({
        where: { email },
    })

    if (!dbUser) {
        // Edge case: user exists in Supabase Auth but not Prisma
        await supabase.auth.signOut()
        return { error: 'User does not exist in our internal system' }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logoutUser() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}
