export class ReportService {
  async getReportKPIs() {
    return {
      trainingHours: '۴۲۰ ساعت',
      passingRate: '۹۲٪',
      averageScore: '۸۱٪',
      totalMedals: '۲۸ مدال',
      medalsBreakdown: '۸ طلا · ۱۲ نقره · ۸ برنز',
    }
  }

  async getAvailableReports() {
    return [
      {
        id: 'rep-1',
        title: 'گزارش ارزیابی جامع مهارتی شاگردان',
        desc: 'تفکیک نمرات تکنیک، فرم، مبارزه و آمادگی بدنی تمامی شاگردان باشگاه.',
        date: 'شهریور ۱۴۰۵',
        format: 'PDF · Excel',
      },
      {
        id: 'rep-2',
        title: 'بیلان نتایج مسابقات و مدال‌آوران',
        desc: 'ثبت نتایج تورنمنت‌های پاییز، مسابقات استانی و جام باشگاه‌ها.',
        date: 'مرداد ۱۴۰۵',
        format: 'PDF',
      },
      {
        id: 'rep-3',
        title: 'گزارش فصلی حضور و غیاب و انضباط',
        desc: 'نرخ حضور شاگردان، غیبت‌های موجه و ساعات تمرینی ثبت‌شده.',
        date: '۳ ماهه تابستان',
        format: 'Excel',
      },
      {
        id: 'rep-4',
        title: 'برنامه و پیش‌بینی آزمون‌های کمربند بعدی',
        desc: 'لیست شاگردان واجد شرایط شرکت در آزمون‌های پایان فصل.',
        date: 'پاییز ۱۴۰۵',
        format: 'PDF',
      },
    ]
  }
}

export const reportService = new ReportService()
