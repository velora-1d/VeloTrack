import { createClient } from './server'
import { prisma } from '@/lib/prisma'

export async function getUserSession() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
    })

    if (!dbUser) {
        return null
    }

    return dbUser
}
