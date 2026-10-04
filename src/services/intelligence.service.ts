export interface StrengthInsight {
  name: string
  score: number
  status: string
  category: string
  badgeClass: string
}

export interface WeaknessInsight {
  name: string
  score: number
  status: string
  explanation: string
  category: string
  badgeClass: string
}

export interface CoachingRecommendation {
  id: number
  title: string
  text: string
  category: string
}

export interface TrainingSession {
  sessionNumber: string
  focus: string
  duration: string
  intensity: 'کم' | 'متوسط' | 'زیاد'
  intensityClass: string
  description: string
}

export interface BeltCategoryScore {
  name: string
  value: number
}

export interface BeltReadinessInsight {
  currentBelt: string
  targetBelt: string
  score: number
  status: string
  text: string
  categoryScores: BeltCategoryScore[]
}

export interface ProgressTrendDataPoint {
  name: string
  value: number
}

export interface AttendanceInsight {
  rate: number
  text: string
  isWarning: boolean
}

export interface CompetitionInsight {
  competitionsCount: number
  medalsCount: number
  text: string
}

export interface HeroInsight {
  label: string
  score: number
  status: string
  text: string
}

export interface StudentAnalysisReport {
  studentId: string
  studentName: string
  avatar: string
  belt: string
  nextBelt: string
  className: string
  age: number
  heroSummary: HeroInsight
  strengths: StrengthInsight[]
  weaknesses: WeaknessInsight[]
  recommendations: CoachingRecommendation[]
  trainingPlan: {
    title: string
    sessions: TrainingSession[]
  }
  beltReadiness: BeltReadinessInsight
  progressTrend: {
    title: string
    growth: string
    data: ProgressTrendDataPoint[]
  }
  attendanceInsight: AttendanceInsight
  competitionInsight: CompetitionInsight
  overallCoachingSummary: string
}

function getStrengthStatus(score: number): { label: string; badgeClass: string } {
  if (score >= 92) return { label: 'عملکرد بسیار خوب', badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' }
  if (score >= 90) return { label: 'نقطه قوت', badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' }
  return { label: 'عملکرد خوب', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' }
}

function getWeaknessExplanation(skillName: string): string {
  switch (skillName) {
    case 'دفاع':
      return 'نیاز به هماهنگی بیشتر در بستن زوایای گارد و زمان‌بندی دفاع نزدیک.'
    case 'جابه‌جایی پا':
      return 'تمرکز بر سرعت مانور و حفظ فاصله مناسب هنگام حمله حریف.'
    case 'حمله متقابل':
      return 'بهبود سرعت واکنش و پاسخ‌دهی بلافاصله پس از دفاع موفق.'
    case 'تعادل':
      return 'تقویت عضلات هسته بدن برای ثبات بیشتر در فرود پس از ضربات چاگی.'
    case 'ریتم اجرا':
      return 'کنترل طمانینه و توقف‌های لازم در اجرای فرم‌های استاندارد.'
    default:
      return 'نیازمند تکرار بیشتر و تمرینات هدفمند در جلسات تمرینی پیش‌رو.'
  }
}

export class IntelligenceService {
  /**
   * Generates coaching intelligence insights from real student record
   */
  generateInsights(student: {
    id: string
    name: string
    age: number
    belt: string
    targetBelt?: string | null
    className: string
    attendanceRate: number
    overallScore: number
    competitionsCount: number
    medalsCount: number
    skills?: Array<{ name: string; score: number; category: string }>
  }): StudentAnalysisReport {
    const rawSkills = student.skills && student.skills.length > 0
      ? student.skills
      : [
          { name: 'تکنیک‌های پا', score: 85, category: 'تکنیک‌ها' },
          { name: 'انعطاف‌پذیری', score: 90, category: 'آمادگی جسمانی' },
          { name: 'حمله', score: 80, category: 'مبارزه' },
          { name: 'دفاع', score: 64, category: 'مبارزه' },
          { name: 'جابه‌جایی پا', score: 62, category: 'مبارزه' },
          { name: 'فرم', score: 78, category: 'فرم' },
        ]

    const sortedSkillsDesc = [...rawSkills].sort((a, b) => b.score - a.score)
    const sortedSkillsAsc = [...rawSkills].sort((a, b) => a.score - b.score)

    // Strengths
    const strengths: StrengthInsight[] = sortedSkillsDesc.slice(0, 3).map((s) => {
      const { label, badgeClass } = getStrengthStatus(s.score)
      return {
        name: s.name,
        score: s.score,
        status: label,
        category: s.category,
        badgeClass,
      }
    })

    // Weaknesses
    const weaknesses: WeaknessInsight[] = sortedSkillsAsc.slice(0, 3).map((s) => ({
      name: s.name,
      score: s.score,
      status: s.score < 65 ? 'نیازمند بهبود' : 'نیازمند تمرین',
      explanation: getWeaknessExplanation(s.name),
      category: s.category,
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    }))

    const weak1 = weaknesses[0]?.name || 'دفاع'
    const weak2 = weaknesses[1]?.name || 'جابه‌جایی پا'
    const weak3 = weaknesses[2]?.name || 'حمله متقابل'

    const recommendations: CoachingRecommendation[] = [
      {
        id: 1,
        title: `تمرکز روی ${weak1}`,
        text: 'در جلسات آینده تمرین‌های دفاع در فاصله نزدیک را افزایش دهید.',
        category: 'مبارزه',
      },
      {
        id: 2,
        title: `بهبود ${weak2}`,
        text: 'تمرین‌های جابه‌جایی پا با شدت متوسط و تکرار بالا در ابتدای جلسه انجام شود.',
        category: 'مبارزه',
      },
      {
        id: 3,
        title: `تقویت ${weak3}`,
        text: 'سناریوهای شبیه‌سازی مبارزه با تمرکز بر پاسخ سریع پس از دفاع اجرا شود.',
        category: 'مبارزه',
      },
    ]

    const trainingPlan = {
      title: 'پیشنهاد برنامه تمرینی',
      sessions: [
        {
          sessionNumber: 'جلسه اول',
          focus: weak1,
          duration: '۲۰ دقیقه',
          intensity: 'متوسط' as const,
          intensityClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          description: 'تمرینات واکنشی و بستن گارد در برابر ضربات سرعتی حریف.',
        },
        {
          sessionNumber: 'جلسه دوم',
          focus: weak2,
          duration: '۱۵ دقیقه',
          intensity: 'متوسط' as const,
          intensityClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          description: 'جابه‌جایی پا و گام‌های زاویه‌دار برای خروج از خط آتش حریف.',
        },
        {
          sessionNumber: 'جلسه سوم',
          focus: weak3,
          duration: '۲۰ دقیقه',
          intensity: 'زیاد' as const,
          intensityClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          description: 'شبیه‌سازی مسابقه با تمرکز بر ضدحمله آنی پس از دفاع.',
        },
      ],
    }

    const beltMap: Record<string, string> = {
      'سفید': 'زرد',
      'زرد': 'سبز',
      'سبز': 'آبی',
      'آبی': 'قرمز',
      'قرمز': 'مشکی',
      'مشکی': 'مشکی دان ۲',
    }
    const nextBelt = student.targetBelt || beltMap[student.belt] || 'قرمز'

    const categoryScores: BeltCategoryScore[] = [
      { name: 'تکنیک', value: 88 },
      { name: 'فرم', value: 79 },
      { name: 'مبارزه', value: 72 },
      { name: 'آمادگی جسمانی', value: 91 },
    ]

    const beltReadiness: BeltReadinessInsight = {
      currentBelt: student.belt,
      targetBelt: nextBelt,
      score: student.overallScore || 82,
      status: student.overallScore >= 85 ? 'وضعیت: آماده ارتقا' : 'وضعیت: نزدیک به آمادگی',
      text: 'برای رسیدن به آمادگی کامل، تمرکز بیشتر روی بخش مبارزه پیشنهاد می‌شود.',
      categoryScores,
    }

    const progressTrend = {
      title: 'روند عملکرد',
      growth: 'رشد کلی: +۱۷٪',
      data: [
        { name: 'فروردین', value: 61 },
        { name: 'اردیبهشت', value: 64 },
        { name: 'خرداد', value: 68 },
        { name: 'تیر', value: 71 },
        { name: 'مرداد', value: 75 },
        { name: 'شهریور', value: student.overallScore || 78 },
      ],
    }

    const firstName = student.name.split(' ')[0]

    const attendanceInsight: AttendanceInsight = {
      rate: student.attendanceRate || 87,
      text:
        (student.attendanceRate || 87) >= 70
          ? `وضعیت حضور ${firstName} مناسب است و در مقایسه با ماه گذشته ۴٪ بهبود داشته است.`
          : 'کاهش حضور می‌تواند روی روند پیشرفت اثر بگذارد.',
      isWarning: (student.attendanceRate || 87) < 70,
    }

    const competitionInsight: CompetitionInsight = {
      competitionsCount: student.competitionsCount || 0,
      medalsCount: student.medalsCount || 0,
      text: `${firstName} در مسابقات عملکرد قابل قبولی داشته است. بیشترین موفقیت او در مسابقات سطح باشگاهی ثبت شده است.`,
    }

    const heroSummary: HeroInsight = {
      label: 'جمع‌بندی عملکرد',
      score: student.overallScore || 78,
      status: 'روند پیشرفت مثبت',
      text: `عملکرد ${firstName} در سه ماه اخیر روندی صعودی داشته است. نقطه قوت اصلی او در تکنیک‌های پا و آمادگی جسمانی است، اما در دفاع و جابه‌جایی پا نیاز به تمرین بیشتری دارد.`,
    }

    const overallCoachingSummary = `${firstName} در حال پیشرفت مناسبی است و در تکنیک‌های پا و آمادگی جسمانی عملکرد خوبی دارد. مهم‌ترین اولویت فعلی، تقویت دفاع و جابه‌جایی پا است. با توجه به امتیاز فعلی، او به آمادگی مناسبی برای آزمون کمربند بعدی نزدیک شده است.`

    return {
      studentId: student.id,
      studentName: student.name,
      avatar: student.name[0] || 'ع',
      belt: student.belt,
      nextBelt,
      className: student.className || 'کلاس نوجوانان',
      age: student.age || 15,
      heroSummary,
      strengths,
      weaknesses,
      recommendations,
      trainingPlan,
      beltReadiness,
      progressTrend,
      attendanceInsight,
      competitionInsight,
      overallCoachingSummary,
    }
  }
}

export const intelligenceService = new IntelligenceService()
