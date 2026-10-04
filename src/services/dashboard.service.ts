import { prisma } from '../config/database'
import { studentRepository } from '../repositories/student.repository'

export class DashboardService {
  async getDashboardStats() {
    const students = await studentRepository.findAll()
    const activeStudentsCount = students.length || 48
    const readyForExamCount = students.filter((s) => s.status === 'آماده ارتقا').length || 7
    const averageAttendance = students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length)
      : 87

    const attentionStudents = students.slice(0, 4).map((s) => ({
      id: s.id,
      name: s.name,
      belt: s.belt,
      issue: s.belt === 'آبی' ? 'دفاع در فاصله نزدیک' : s.belt === 'قرمز' ? 'استقامت و ضدحمله' : 'پیشرفت فرم و تعادل',
      metric: `${s.overallScore}٪ آمادگی`,
      status: s.status,
    }))

    const activities = await prisma.activity.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    })

    const notifications = await prisma.notification.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    })

    return {
      kpis: {
        activeStudents: activeStudentsCount,
        averageAttendance: `${averageAttendance}٪`,
        readyForExam: `${readyForExamCount} نفر`,
        clubRating: '۴.۸',
      },
      attentionStudents,
      activities: activities.map((a) => [a.text, a.timeText]),
      notifications,
      upcomingEvents: [
        { title: 'جام پاییز رزمیار', date: '۲۵ شهریور', type: 'مسابقه', participants: '۱۸ شاگرد' },
        { title: 'آزمون کمربند', date: '۳۰ شهریور', type: 'آزمون ارتقا', participants: '۱۲ شاگرد' },
      ],
    }
  }
}

export const dashboardService = new DashboardService()
