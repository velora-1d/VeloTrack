import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  let owner = await prisma.user.findFirst({ where: { role: 'OWNER' } })
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        name: 'Owner Admin',
        email: 'owner@velotrack.local',
        role: 'OWNER'
      }
    })
  }
  console.log("OWNER_ID=" + owner.id)
}
main().catch(console.error).finally(() => prisma.$disconnect())
