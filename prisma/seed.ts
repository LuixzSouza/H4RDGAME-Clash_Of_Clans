import { PrismaClient, Role, WarPreference } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Gera o hash da senha padrão
  const hashedPassword = await bcrypt.hash('123456', 10)

  // --- 1. CRIAR OU ATUALIZAR O LÍDER SUPREMO (ADMIN) ---
  const lider = await prisma.member.upsert({
    where: { tag: '#ADMIN' },
    update: {
      role: 'LIDER', // Força virar LÍDER se já existir
      thLevel: 16,
      password: hashedPassword,
      name: 'Luiz Admin'
      // OBS: Removemos 'tickets' daqui pois não existe mais na tabela Member
    },
    create: {
      name: 'Luiz Admin',
      tag: '#ADMIN',
      password: hashedPassword,
      role: 'LIDER',
      thLevel: 16,
      avatarSeed: 'LuizAdmin',
      warStatus: 'IN'
      // OBS: Removemos 'tickets' daqui também
    },
  })

  console.log('✅ Admin atualizado:', lider.name)

  // --- 2. CRIAR UM EVENTO FINANCEIRO DE TESTE ---
  // Como tickets agora pertencem a eventos, precisamos de um evento
  const eventoSeed = await prisma.financeEvent.create({
    data: {
      title: "Sorteio Inaugural (Seed)",
      ticketPrice: 2.50,
      goalAmount: 50.00,
      status: "ACTIVE"
    }
  })
  console.log('✅ Evento financeiro criado:', eventoSeed.title)

  // --- 3. DAR TICKETS INFINITOS AO ADMIN NESTE EVENTO ---
  await prisma.eventParticipation.upsert({
    where: {
      eventId_memberId: {
        eventId: eventoSeed.id,
        memberId: lider.id
      }
    },
    update: {
        tickets: 99 // Atualiza se já existir
    },
    create: {
      eventId: eventoSeed.id,
      memberId: lider.id,
      tickets: 99 // Cria com 99 tickets
    }
  })
  console.log('✅ Tickets atribuídos ao Admin no evento.')

  // --- 4. (OPCIONAL) CRIAR OUTROS MEMBROS PARA TESTE ---
  const dummyMembers = [
    { name: "Vice Comandante", tag: "#VICE", role: Role.COLIDER, th: 15 },
    { name: "Veterano", tag: "#ANCIAO", role: Role.ANCIAO, th: 13 },
    { name: "Recruta Zero", tag: "#NOOB", role: Role.MEMBRO, th: 9 },
  ]

  for (const m of dummyMembers) {
    await prisma.member.upsert({
      where: { tag: m.tag },
      update: { role: m.role },
      create: {
        name: m.name,
        tag: m.tag,
        role: m.role,
        password: hashedPassword,
        thLevel: m.th,
        warStatus: WarPreference.IN
      }
    })
  }
  console.log('✅ Membros dummy criados.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })