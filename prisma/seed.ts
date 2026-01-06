import { PrismaClient, Role, WarPreference } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...')

  // 1. Gerar Hash da Senha Padrão (123456)
  const passwordHash = await bcrypt.hash('123456', 10)

  // --- 2. CRIAR O LÍDER SUPREMO (VOCÊ) ---
  // Use Tag: #ADMIN e Senha: 123456 para logar
  const admin = await prisma.member.upsert({
    where: { tag: '#ADMIN' },
    update: {
      role: Role.LIDER, // Garante que seja LÍDER
      thLevel: 16,
      password: passwordHash,
      isActive: true,
      warStatus: WarPreference.IN
    },
    create: {
      name: 'Luixz Admin',
      tag: '#ADMIN',
      role: Role.LIDER,
      thLevel: 16,
      password: passwordHash,
      warStatus: WarPreference.IN,
      isActive: true,
      phone: '5535999999999' // Exemplo de telefone para testar o botão de Zap
    },
  })
  console.log(`👑 Admin criado/atualizado: ${admin.name} (${admin.role})`)

  // --- 3. CRIAR MEMBROS DUMMY PARA TESTAR HIERARQUIA ---
  const dummies = [
    { name: 'General War', tag: '#COLIDER', role: Role.COLIDER, th: 15 },
    { name: 'Strategist', tag: '#ANCIAO', role: Role.ANCIAO, th: 13 },
    { name: 'Recruta Zero', tag: '#MEMBRO', role: Role.MEMBRO, th: 9 },
  ]

  for (const dummy of dummies) {
    await prisma.member.upsert({
      where: { tag: dummy.tag },
      update: { role: dummy.role, isActive: true },
      create: {
        name: dummy.name,
        tag: dummy.tag,
        role: dummy.role,
        thLevel: dummy.th,
        password: passwordHash, // Todos com senha 123456 para facilitar teste
        warStatus: WarPreference.IN,
        isActive: true
      }
    })
  }
  console.log('👥 Membros de teste criados (Colíder, Ancião, Membro).')

  // --- 4. CRIAR UM EVENTO FINANCEIRO (NECESSÁRIO PARA TICKETS) ---
  // Verifica se já existe um evento ativo, se não, cria um.
  let activeEvent = await prisma.financeEvent.findFirst({
    where: { status: 'ACTIVE' }
  })

  if (!activeEvent) {
    activeEvent = await prisma.financeEvent.create({
      data: {
        title: 'Sorteio Mensal (Seed)',
        ticketPrice: 2.50, // R$ 2,50 por ticket
        goalAmount: 50.00, // Meta R$ 50,00
        status: 'ACTIVE'
      }
    })
    console.log('💰 Evento financeiro criado:', activeEvent.title)
  } else {
    console.log('💰 Evento financeiro existente encontrado:', activeEvent.title)
  }

  // --- 5. DAR TICKETS AO ADMIN ---
  // Agora os tickets ficam na tabela EventParticipation
  await prisma.eventParticipation.upsert({
    where: {
      // Chave composta (eventId + memberId)
      eventId_memberId: {
        eventId: activeEvent.id,
        memberId: admin.id
      }
    },
    update: {
      tickets: 10 // Atualiza para 10 se já existir
    },
    create: {
      eventId: activeEvent.id,
      memberId: admin.id,
      tickets: 10
    }
  })
  console.log('🎟️ 10 Tickets adicionados ao Admin no evento atual.')

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })