import NextAuth from 'next-auth'
import { config } from '@/auth'

export const runtime = 'nodejs'

const handler = NextAuth(config)

export { handler as GET, handler as POST }
