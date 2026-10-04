import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Razmyar multi-club & role database seeding...')

  // 1. Clear existing data
  await prisma.activity.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.studentNote.deleteMany()
  await prisma.attendanceRecord.deleteMany()
  await prisma.medalWinner.deleteMany()
  await prisma.match.deleteMany()
  await prisma.competitionParticipant.deleteMany()
  await prisma.competitionCategory.deleteMany()
  await prisma.competition.deleteMany()
  await prisma.promotionHistory.deleteMany()
  await prisma.assessment.deleteMany()
  await prisma.studentSkill.deleteMany()
  await prisma.workout.deleteMany()
  await prisma.task.deleteMany()
  await prisma.finance.deleteMany()
  await prisma.beltConfig.deleteMany()
  await prisma.student.deleteMany()
  await prisma.user.deleteMany()
  await prisma.club.deleteMany()
  await prisma.team.deleteMany()

  // 2. Create Teams
  const teamFajr = await prisma.team.create({
    data: {
      id: 'FAJR',
      name: 'تیم فجر',
      status: 'ACTIVE',
    },
  })

  const teamX = await prisma.team.create({
    data: {
      id: 'TEAM_X',
      name: 'تیم X',
      status: 'ACTIVE',
    },
  })

  // 3. Create Clubs for Team Fajr
  const clubParto = await prisma.club.create({
    data: {
      id: 'PARTO',
      teamId: teamFajr.id,
      name: 'باشگاه پرتو',
      coachName: 'استاد امینی',
      phone: '۰۲۱۲۲۳۳۴۴۵۵',
      mainDiscipline: 'tkd',
      passingScore: 75,
      evaluationPeriodDays: 30,
    },
  })

  const clubSarvestan = await prisma.club.create({
    data: {
      id: 'SARVESTAN',
      teamId: teamFajr.id,
      name: 'باشگاه سروستان',
      coachName: 'استاد رحیمی',
      phone: '۰۲۱۶۶۷۷۸۸۹۹',
      mainDiscipline: 'tkd',
      passingScore: 75,
      evaluationPeriodDays: 30,
    },
  })

  const clubHejab = await prisma.club.create({
    data: {
      id: 'HEJAB',
      teamId: teamFajr.id,
      name: 'باشگاه حجاب',
      coachName: 'استاد کریمی',
      phone: '۰۲۱۴۴۵۵۶۶۷۷',
      mainDiscipline: 'tkd',
      passingScore: 75,
      evaluationPeriodDays: 30,
    },
  })

  // Clubs for Team X
  await prisma.club.create({
    data: {
      id: 'CLUB_X1',
      teamId: teamX.id,
      name: 'باشگاه پیروزی X1',
      coachName: 'استاد رادمنش',
      phone: '۰۲۱۸۸۹۹۰۰۱۱',
      mainDiscipline: 'karate',
    },
  })

  await prisma.club.create({
    data: {
      id: 'CLUB_X2',
      teamId: teamX.id,
      name: 'باشگاه امید X2',
      coachName: 'استاد بهرامی',
      phone: '۰۲۱۷۷۶۶۵۵۴۴',
      mainDiscipline: 'tkd',
    },
  })

  // 4. Create Users (SUPER_ADMIN, TEAM_ADMIN, USER)
  const defaultPassword = await bcrypt.hash('123456', 10)

  // 1. SUPER_ADMIN (Platform Owner)
  await prisma.user.create({
    data: {
      email: 'owner@razmyar.ir',
      password: defaultPassword,
      name: 'مدیر کل پلتفرم (Platform Owner)',
      role: 'SUPER_ADMIN',
      teamId: null, // Super admin is not tied to any team
    },
  })

  // 2. TEAM_ADMIN (Fajr Team Admin)
  await prisma.user.create({
    data: {
      email: 'fajr@razmyar.ir',
      password: defaultPassword,
      name: 'مدیر تیم فجر (Fajr Team Admin)',
      role: 'TEAM_ADMIN',
      teamId: teamFajr.id,
    },
  })

  // Also support coach_fajr as username/email
  await prisma.user.create({
    data: {
      email: 'coach_fajr',
      password: defaultPassword,
      name: 'مربی ارشد تیم فجر',
      role: 'TEAM_ADMIN',
      teamId: teamFajr.id,
    },
  })

  // 3. TEAM_ADMIN (Team X Admin)
  await prisma.user.create({
    data: {
      email: 'teamx@razmyar.ir',
      password: defaultPassword,
      name: 'مدیر تیم X (Team X Admin)',
      role: 'TEAM_ADMIN',
      teamId: teamX.id,
    },
  })

  // 4. Regular User
  await prisma.user.create({
    data: {
      email: 'user@razmyar.ir',
      password: defaultPassword,
      name: 'هنرجوی عادی (Regular User)',
      role: 'USER',
      teamId: teamFajr.id,
    },
  })

  // 5. Create Belt Configurations
  const defaultBelts = [
    { id: 'belt-white', discipline: 'taekwondo', name: 'سفید', order: 1, color: '#e2e8f0', bgColor: 'bg-slate-100/10', textColor: 'text-slate-200', borderColor: 'border-slate-400', dotColor: 'bg-slate-300' },
    { id: 'belt-yellow', discipline: 'taekwondo', name: 'زرد', order: 2, color: '#eab308', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400', borderColor: 'border-amber-500', dotColor: 'bg-amber-400' },
    { id: 'belt-green', discipline: 'taekwondo', name: 'سبز', order: 3, color: '#22c55e', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400', borderColor: 'border-emerald-500', dotColor: 'bg-emerald-400' },
    { id: 'belt-blue', discipline: 'taekwondo', name: 'آبی', order: 4, color: '#06b6d4', bgColor: 'bg-cyan-500/10', textColor: 'text-cyan-400', borderColor: 'border-cyan-500', dotColor: 'bg-cyan-400' },
    { id: 'belt-red', discipline: 'taekwondo', name: 'قرمز', order: 5, color: '#ef4444', bgColor: 'bg-rose-500/10', textColor: 'text-rose-400', borderColor: 'border-rose-500', dotColor: 'bg-rose-400' },
    { id: 'belt-black', discipline: 'taekwondo', name: 'مشکی (دان ۱)', order: 6, color: '#0f172a', bgColor: 'bg-zinc-800', textColor: 'text-zinc-100', borderColor: 'border-zinc-700', dotColor: 'bg-zinc-300' },
  ]

  for (const b of defaultBelts) {
    await prisma.beltConfig.create({
      data: {
        id: b.id,
        discipline: b.discipline,
        name: b.name,
        order: b.order,
        color: b.color,
        bgColor: b.bgColor,
        textColor: b.textColor,
        borderColor: b.borderColor,
        dotColor: b.dotColor,
        minimumOverallScore: 70,
        categoryRequirements: JSON.stringify([{ category: 'فرم', minimumScore: 75 }]),
        skillRequirements: JSON.stringify([{ id: 'req-1', category: 'فرم', name: 'پومسه تگوک', minimumScore: 75 }]),
      },
    })
  }

  // 6. Create Students divided across clubs of Team Fajr
  // Club Parto Students
  const aliRezaei = await prisma.student.create({
    data: {
      id: '1024',
      studentNumber: '۱۰۲۴',
      name: 'علی رضایی',
      age: 15,
      belt: 'آبی',
      targetBelt: 'قرمز',
      className: 'کلاس نوجوانان الف',
      mobile: '۰۹۱۲۱۱۱۱۱۱۱',
      parentName: 'محمدرضا رضایی',
      parentMobile: '۰۹۱۲۲۲۲۲۲۲۲',
      joinedAt: '۱۰ اردیبهشت ۱۴۰۳',
      experience: '۲ سال و ۴ ماه',
      avatar: 'ع',
      avatarColor: 'from-cyan-500 to-blue-600',
      color: 'bg-cyan-500',
      status: 'آماده ارتقا',
      attendanceRate: 87,
      overallScore: 82,
      medalsCount: 2,
      competitionsCount: 3,
      teamId: teamFajr.id,
      clubId: clubParto.id,
    },
  })

  await prisma.student.create({
    data: {
      id: '1025',
      studentNumber: '۱۰۲۵',
      name: 'سارا کریمی',
      age: 14,
      belt: 'سبز',
      targetBelt: 'آبی',
      className: 'بانوان و نوجوانان',
      avatar: 'س',
      color: 'bg-emerald-500',
      status: 'آماده ارتقا',
      attendanceRate: 93,
      overallScore: 91,
      teamId: teamFajr.id,
      clubId: clubParto.id,
    },
  })

  await prisma.student.create({
    data: {
      id: '1026',
      studentNumber: '۱۰۲۶',
      name: 'محمد احمدی',
      age: 17,
      belt: 'قرمز',
      targetBelt: 'مشکی',
      className: 'جوانان و بزرگسالان',
      avatar: 'م',
      color: 'bg-rose-500',
      status: 'نیازمند تمرین',
      attendanceRate: 81,
      overallScore: 74,
      teamId: teamFajr.id,
      clubId: clubParto.id,
    },
  })

  // Club Sarvestan Students
  await prisma.student.create({
    data: {
      id: '1027',
      studentNumber: '۱۰۲۷',
      name: 'نگار کریمی',
      age: 13,
      belt: 'زرد',
      targetBelt: 'سبز',
      className: 'نونهالان',
      avatar: 'ن',
      color: 'bg-amber-500',
      status: 'فعال',
      attendanceRate: 90,
      overallScore: 88,
      teamId: teamFajr.id,
      clubId: clubSarvestan.id,
    },
  })

  await prisma.student.create({
    data: {
      id: '1028',
      studentNumber: '۱۰۲۸',
      name: 'سینا کریمی',
      age: 16,
      belt: 'آبی',
      targetBelt: 'قرمز',
      className: 'نوجوانان الف',
      avatar: 'س',
      color: 'bg-indigo-500',
      status: 'فعال',
      attendanceRate: 84,
      overallScore: 76,
      teamId: teamFajr.id,
      clubId: clubSarvestan.id,
    },
  })

  // Club Hejab Students
  await prisma.student.create({
    data: {
      id: '1029',
      studentNumber: '۱۰۲۹',
      name: 'پارسا یوسفی',
      age: 16,
      belt: 'قرمز',
      targetBelt: 'مشکی',
      className: 'نوجوانان الف',
      avatar: 'پ',
      color: 'bg-blue-500',
      status: 'فعال',
      attendanceRate: 88,
      overallScore: 85,
      teamId: teamFajr.id,
      clubId: clubHejab.id,
    },
  })

  await prisma.student.create({
    data: {
      id: '1030',
      studentNumber: '۱۰۳۰',
      name: 'مهدی رحیمی',
      age: 18,
      belt: 'مشکی',
      targetBelt: 'دان ۲',
      className: 'تیم مسابقات',
      avatar: 'م',
      color: 'bg-zinc-700',
      status: 'آماده ارتقا',
      attendanceRate: 95,
      overallScore: 94,
      teamId: teamFajr.id,
      clubId: clubHejab.id,
    },
  })

  // 7. Student Skills for Ali Rezaei
  const aliSkills = [
    { name: 'آپ چاگی (ضربه مستقیم)', category: 'تکنیک‌ها', score: 85 },
    { name: 'دولی چاگی (ضربه دورانی)', category: 'تکنیک‌ها', score: 80 },
    { name: 'پومسه تگوک سا جانگ (فرم ۴)', category: 'فرم', score: 82 },
    { name: 'کیوروگی (مبارزه آزاد)', category: 'مبارزه', score: 84 },
    { name: 'انعطاف‌پذیری و چابکی', category: 'آمادگی جسمانی', score: 78 },
  ]
  for (const s of aliSkills) {
    await prisma.studentSkill.create({
      data: {
        studentId: aliRezaei.id,
        name: s.name,
        category: s.category,
        score: s.score,
      },
    })
  }

  // 8. Create Workouts for Clubs
  await prisma.workout.create({
    data: {
      teamId: teamFajr.id,
      clubId: clubParto.id,
      title: 'تمرین تخصصی پومسه و ضربات سرعتی',
      groupName: 'نوجوانان الف - پرتو',
      dateText: 'شنبه، ۲۲ شهریور ۱۴۰۵',
      timeText: '۱۷:۰۰',
      durationMin: 90,
      focusArea: 'تکنیک و انعطاف',
      notes: 'مرور فرم ۴ و ۵ با تاکید بر تعادل پا',
    },
  })

  await prisma.workout.create({
    data: {
      teamId: teamFajr.id,
      clubId: clubSarvestan.id,
      title: 'تمرین مبارزه هوشمند و گارد دفاعی',
      groupName: 'نوجوانان ب - سروستان',
      dateText: 'یک‌شنبه، ۲۳ شهریور ۱۴۰۵',
      timeText: '۱۸:۳۰',
      durationMin: 90,
      focusArea: 'مبارزه کاربردی',
      notes: 'شبیه‌سازی شرایط مسابقه با سیستم الکترونیک',
    },
  })

  await prisma.workout.create({
    data: {
      teamId: teamFajr.id,
      clubId: clubHejab.id,
      title: 'آمادگی جسمانی و بدنسازی رزمی',
      groupName: 'تیم قهرمانی - حجاب',
      dateText: 'دوشنبه، ۲۴ شهریور ۱۴۰۵',
      timeText: '۱۹:۰۰',
      durationMin: 75,
      focusArea: 'آمادگی جسمانی',
      notes: 'تمرینات اینتروال و پلایومتریک',
    },
  })

  // 9. Create Tasks
  await prisma.task.create({
    data: {
      teamId: teamFajr.id,
      clubId: clubParto.id,
      title: 'ارزیابی نهایی فرم علی رضایی برای کمربند قرمز',
      description: 'بررسی صحت زاویه ضربات یوپ چاگی و هماهنگی تنفس',
      dueDate: '۲۸ شهریور ۱۴۰۵',
      priority: 'HIGH',
      status: 'PENDING',
    },
  })

  await prisma.task.create({
    data: {
      teamId: teamFajr.id,
      clubId: clubSarvestan.id,
      title: 'ثبت‌نام شرکت‌کنندگان در مسابقه استانی',
      description: 'جمع‌آوری مدارک بیمه ورزشی و رضایت‌نامه اولیا',
      dueDate: '۳۰ شهریور ۱۴۰۵',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    },
  })

  // 10. Create Finance Entries
  await prisma.finance.create({
    data: {
      teamId: teamFajr.id,
      clubId: clubParto.id,
      title: 'شهریه ماهانه شهریور - علی رضایی',
      amount: 850000,
      type: 'INCOME',
      category: 'شهریه',
      dateText: '۱۰ شهریور ۱۴۰۵',
      paidBy: 'محمدرضا رضایی',
      status: 'COMPLETED',
    },
  })

  await prisma.finance.create({
    data: {
      teamId: teamFajr.id,
      clubId: clubSarvestan.id,
      title: 'خرید هوگو و میت استاندارد فدراسیونی',
      amount: 4200000,
      type: 'EXPENSE',
      category: 'تجهیزات',
      dateText: '۱۲ شهریور ۱۴۰۵',
      paidBy: 'باشگاه سروستان',
      status: 'COMPLETED',
    },
  })

  // 11. Activities & Notifications
  await prisma.activity.create({
    data: {
      text: 'آزمون مهارتی علی رضایی در باشگاه پرتو با نمره ۸۲ ثبت شد',
      timeText: '۲ ساعت پیش',
    },
  })
  await prisma.activity.create({
    data: {
      text: 'جلسه تمرینی نوجوانان سروستان برگزار شد',
      timeText: '۵ ساعت پیش',
    },
  })

  await prisma.notification.create({
    data: {
      title: '۷ شاگرد آماده آزمون ارتقای کمربند در تیم فجر هستند',
      timeText: 'امروز',
      type: 'success',
    },
  })

  console.log('✅ Multi-club database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error in seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
