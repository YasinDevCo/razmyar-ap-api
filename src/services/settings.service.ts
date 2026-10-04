import { clubRepository } from '../repositories/club.repository'

export class SettingsService {
  async getSettings() {
    const club = await clubRepository.findFirst()
    if (!club) {
      return {
        name: 'باشگاه تکواندو امینی',
        coachName: 'استاد امینی',
        phone: '۰۲۱۲۲۳۳۴۴۵۵',
        mainDiscipline: 'tkd',
        passingScore: 75,
        evaluationPeriodDays: 30,
      }
    }
    return club
  }

  async updateSettings(data: {
    name?: string
    coachName?: string
    phone?: string
    mainDiscipline?: string
    passingScore?: number
    evaluationPeriodDays?: number
  }) {
    const club = await clubRepository.findFirst()
    if (!club) {
      throw new Error('باشگاه یافت نشد')
    }
    return clubRepository.update(club.id, data)
  }
}

export const settingsService = new SettingsService()
